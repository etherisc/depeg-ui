import { Coder } from "abi-coder";
import DepegProductBuild from '@etherisc/depeg-contracts/build/contracts/DepegProduct.json';
import { BigNumber, ContractReceipt, ContractTransaction, Signer, VoidSigner } from "ethers";
import { DepegProduct, DepegProduct__factory, DepegRiskpool, IInstanceService } from "../contracts/depeg-contracts";
import { getDepegRiskpool, getInstanceService } from "./gif_registry";
import { APPLICATION_STATE_UNDERWRITTEN, PAYOUT_STATE_EXPECTED, PAYOUT_STATE_PAIDOUT, PolicyData } from "./policy_data";
import { TransactionFailedError } from "../utils/error";
import { ProductState } from "../types/product_state";

export class DepegProductApi {

    private depegProductAddress: string;
    private signer: Signer;
    private depegProduct?: DepegProduct;
    private depegRiskpool?: DepegRiskpool;
    private depegRiskpoolId?: number;
    private instanceService?: IInstanceService;
    // the factor to calculate the protected amount based on the sum insured 
    private protectedAmountFactor = 1;

    constructor(
        depegProductAddress: string,
        signer: Signer
    ) {
        this.depegProductAddress = depegProductAddress;
        this.signer = signer;
    }

    async initialize() {
        this.depegProduct = DepegProduct__factory.connect(this.depegProductAddress, this.signer);
        const registryAddress = await this.depegProduct.getRegistry();
        this.instanceService = await getInstanceService(registryAddress, this.signer);
        this.depegRiskpoolId = (await this.depegProduct.getRiskpoolId()).toNumber();
        this.depegRiskpool = await getDepegRiskpool(this.instanceService, this.depegRiskpoolId);
        this.protectedAmountFactor = 100 / (await this.depegRiskpool.getSumInsuredPercentage()).toNumber();
    }

    isInitialized(): boolean {
        return this.instanceService !== undefined;
    }

    getRiskpoolId(): number {
        return this.depegRiskpoolId ?? 0;
    }

    isVoidSigner(): boolean {
        return this.signer instanceof VoidSigner;
    }

    getSigner(): Signer {
        return this.signer;
    }

    getDepegProduct(): DepegProduct {
        return this.depegProduct!;
    }
    
    getDepegRiskpool(): DepegRiskpool {
        return this.depegRiskpool!;
    }

    getInstanceService(): IInstanceService {
        return this.instanceService!;
    }

    async getUsd2Address(): Promise<string> {
        return await this.depegProduct!.getToken();
    }

    extractProcessIdFromApplicationLogs(logs: any[]): string|undefined {
        const productAbiCoder = new Coder(DepegProductBuild.abi);
        let processId = undefined;
    
        logs.forEach(log => {
            try {
                const evt = productAbiCoder.decodeEvent(log.topics, log.data);
                console.log(evt);
                if (evt.name === 'LogDepegPolicyCreated') {
                    console.log(evt);
                    // @ts-ignore
                    processId = evt.values.processId.toString();
                }
            } catch (e) {
                console.log(e);
            }
        });
    
        return processId;
    }
    
    async applyForDepegPolicy(
        walletAddress: string,
        insuredAmount: BigNumber, 
        coverageDurationSeconds: number, 
        bundleId: number, 
        beforeApplyCallback?: (address: string) => void,
        beforeWaitCallback?: (address: string) => void,
    ): Promise<[ContractTransaction, ContractReceipt]> {
        if (beforeApplyCallback !== undefined) {
            beforeApplyCallback(this.depegProduct!.address);
        }
        try {
            const tx = await this.depegProduct!.applyForPolicyWithBundle(
                walletAddress,
                insuredAmount, 
                coverageDurationSeconds,
                bundleId);
            if (beforeWaitCallback !== undefined) {
                beforeWaitCallback(this.depegProduct!.address);
            }
            const receipt = await tx.wait();
            // console.log(receipt);
            return [tx, receipt];
        } catch (e) {
            console.log("caught error while applying for policy: ", e);
            // @ts-ignore e.code
            throw new TransactionFailedError(e.code, e);
        }
    }
    
    async getPoliciesCount(
        ownerWalletAddress: string
    ): Promise<number> {
        return (await this.depegProduct!.processIds(ownerWalletAddress)).toNumber();        
    }
    
    async getPolicies(
        ownerWalletAddress: string
    ): Promise<Array<PolicyData>> {
        const numPolicies = (await this.depegProduct!.processIds(ownerWalletAddress)).toNumber();
    
        const policies = new Array();
        
        for (let i = 0; i < numPolicies; i++) {
            const policy = await this.getPolicyForProduct(ownerWalletAddress, i);
            policies.push(policy);
        }
    
        return policies;
    }
    
    
    async getPolicy(
        ownerWalletAddress: string,
        idx: number,
        checkClaim: boolean,
    ): Promise<PolicyData> {
        const policy = await this.getPolicyForProduct(ownerWalletAddress, idx);
        if (checkClaim) {
            const isAllowedToClaim = await this.depegProduct!.policyIsAllowedToClaim(policy.id);
            policy.isAllowedToClaim = isAllowedToClaim;

            const hasClaim = await this.depegProduct!.hasDepegClaim(policy.id);

            if (hasClaim) {
                const { actualAmount, claimState, claimAmount, claimCreatedAt } = await this.depegProduct!.getClaimData(policy.id);
                policy.claim = {
                    actualAmount: actualAmount.toString(),
                    state: claimState,
                    paidAmount: undefined,
                    claimAmount: claimAmount.toString(),
                    claimCreatedAt: claimCreatedAt.toNumber(),
                }

                if (claimState == 3) { // state is closed
                    const claim = await this.instanceService!.getClaim(policy.id, 0); // claim id is always 0 for depeg
                    policy.claim!.paidAmount = claim.paidAmount.toString();
                }
            }
        }
        return policy;
    }
    
    async getPolicyForProduct(
            ownerWalletAddress: string,
            idx: number,
            ): Promise<PolicyData> {
        const processId = await this.depegProduct!.getProcessId(ownerWalletAddress, idx);
        const { state, premiumAmount, sumInsuredAmount, data, createdAt } = await this.instanceService!.getApplication(processId);
        const { owner } = await this.instanceService!.getMetadata(processId);
        let policyState = undefined;
        let payoutState = undefined;
        if ( state == APPLICATION_STATE_UNDERWRITTEN ) {
            const policy = await this.instanceService!.getPolicy(processId);
            [ policyState ] = policy;
            const claimsCount = (await this.instanceService!.claims(processId)).toNumber();
            if (claimsCount > 0) {
                const payoutCount = (await this.instanceService!.payouts(processId)).toNumber();
                if (payoutCount > 0) {
                    payoutState = PAYOUT_STATE_PAIDOUT;
                } else {
                    payoutState = PAYOUT_STATE_EXPECTED;
                }
            }
        }
        const { wallet, duration } = await this.depegRiskpool!.decodeApplicationParameterFromData(data);
        return {
            id: processId,
            policyHolder: owner,
            protectedWallet: wallet,
            applicationState: state,
            policyState: policyState,
            payoutState: payoutState,
            createdAt: createdAt.toNumber(),
            premium: premiumAmount.toString(),
            suminsured: sumInsuredAmount.mul(this.protectedAmountFactor).toString(),
            payoutCap: sumInsuredAmount.toString(),
            duration: duration.toNumber(),
            isAllowedToClaim: false,
        } as PolicyData;
    }

    async getProductState(): Promise<ProductState> {
        const state = await this.depegProduct!.getDepegState();
        switch (state) {
            case 0:
            case 1:
                return ProductState.Active;
            case 2:
                return ProductState.Paused;
            case 3:
                return ProductState.Depegged;
            default:
                throw new Error("Unknown product state: " + state);
        }
    }

    async claim(
        processId: string,
        beforeApplyCallback?: (address: string) => void,
        beforeWaitCallback?: (address: string) => void,
    ): Promise<[ContractTransaction, ContractReceipt]> {
        if (beforeApplyCallback !== undefined) {
            beforeApplyCallback(this.depegProduct!.address);
        }
        try {
            const tx = await this.depegProduct!.createDepegClaim(processId)
            if (beforeWaitCallback !== undefined) {
                beforeWaitCallback(this.depegProduct!.address);
            }
            const receipt = await tx.wait();
            // console.log(receipt);
            return [tx, receipt];
        } catch (e) {
            console.log("caught error while creating a depeg claim: ", e);
            // @ts-ignore e.code
            throw new TransactionFailedError(e.code, e);
        }
    }

    extractClaimIdFromLogs(logs: any[]): string|undefined {
        const productAbiCoder = new Coder(DepegProductBuild.abi);
        let claimId = undefined;
    
        logs.forEach(log => {
            try {
                const evt = productAbiCoder.decodeEvent(log.topics, log.data);
                console.log(evt);
                if (evt.name === 'LogDepegClaimCreated') {
                    console.log(evt);
                    // @ts-ignore
                    claimId = evt.values.claimId.toString();
                }
            } catch (e) {
                console.log(e);
            }
        });
    
        return claimId;
    }

}


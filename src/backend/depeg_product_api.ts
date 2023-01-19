import { Coder } from "abi-coder";
import DepegProductBuild from '@etherisc/depeg-contracts/build/contracts/DepegProduct.json';
import { ContractReceipt, ContractTransaction, Signer, VoidSigner } from "ethers";
import { DepegProduct, DepegProduct__factory, DepegRiskpool } from "../contracts/depeg-contracts";
import { getDepegRiskpool, getInstanceService } from "./gif_registry";
import { IInstanceService } from "../contracts/gif-interface";
import { APPLICATION_STATE_UNDERWRITTEN, PolicyData } from "./policy_data";
import { TransactionFailedError } from "../utils/error";

export class DepegProductApi {

    private depegProductAddress: string;
    private signer: Signer;
    private depegProduct?: DepegProduct;
    private depegRiskpool?: DepegRiskpool;
    private depegRiskpoolId?: number;
    private instanceService?: IInstanceService;

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
        insuredAmount: number, 
        coverageDurationDays: number, 
        premium: number, 
        beforeApplyCallback?: (address: string) => void,
        beforeWaitCallback?: (address: string) => void
    ): Promise<[ContractTransaction, ContractReceipt]> {
        if (beforeApplyCallback !== undefined) {
            beforeApplyCallback(this.depegProduct!.address);
        }
        try {
            const tx = await this.depegProduct!.applyForPolicy(
                walletAddress,
                insuredAmount, 
                coverageDurationDays * 24 * 60 * 60,
                premium);
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
    ): Promise<PolicyData> {
        return this.getPolicyForProduct(ownerWalletAddress, idx);
    }
    
    async getPolicyForProduct(
            ownerWalletAddress: string,
            idx: number,
            ): Promise<PolicyData> {
        const processId = await this.depegProduct!.getProcessId(ownerWalletAddress, idx);
        const application = await this.instanceService!.getApplication(processId);
        const [ applicationState, premium, suminsured, appdata, createdAt ] = application;
        let policyState = undefined;
        let payoutState = undefined;
        if ( applicationState == APPLICATION_STATE_UNDERWRITTEN ) {
            const policy = await this.instanceService!.getPolicy(processId);
            [ policyState ] = policy;
            const payoutsCount = (await this.instanceService!.payouts(processId)).toNumber();
            if (payoutsCount > 0) {
                // this is a simplification as Depeg insureance can only have 0 or 1 payouts
                const payout = await this.instanceService!.getPayout(processId, 0);
                [ payoutState ] = payout;
            }
        }
        const { wallet, duration } = await this.depegRiskpool!.decodeApplicationParameterFromData(appdata);
        return {
            id: processId,
            owner: wallet,
            applicationState: applicationState,
            policyState: policyState,
            payoutState: payoutState,
            createdAt: createdAt,
            premium: premium,
            suminsured: suminsured,
            duration: duration,
        } as PolicyData;
    }

}


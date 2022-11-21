import { Coder } from "abi-coder";
import DepegProductBuild from '@etherisc/depeg-contracts/build/contracts/DepegProduct.json';
import { ContractReceipt, ContractTransaction, Signer } from "ethers";
import { DepegProduct, DepegProduct__factory, DepegRiskpool } from "../../contracts/depeg-contracts";
import { getDepegRiskpool, getInstanceService } from "./gif_registry";
import { IInstanceService } from "../../contracts/gif-interface";
import { APPLICATION_STATE_APPLIED, APPLICATION_STATE_DECLINED, APPLICATION_STATE_REVOKED, APPLICATION_STATE_UNDERWRITTEN, PolicyData, POLICY_STATE_ACTIVE, POLICY_STATE_CLOSED, POLICY_STATE_EXPIRED } from "./policy_data";
import moment, { Moment } from "moment";

export async function getInstanceFromProduct(depegProductContractAddress: string, signer: Signer): 
        Promise<[DepegProduct, DepegRiskpool, number, IInstanceService]>
        {
    const product = DepegProduct__factory.connect(depegProductContractAddress, signer);
    const registryAddress = await product.getRegistry();
    const instanceService = await getInstanceService(registryAddress, signer);
    const riskpoolId = (await product.getRiskpoolId()).toNumber();
    const riskpool = await getDepegRiskpool(instanceService, riskpoolId);
    return [ product, riskpool, riskpoolId, instanceService ];
}

export function extractProcessIdFromApplicationLogs(logs: any[]): string|undefined {
    const productAbiCoder = new Coder(DepegProductBuild.abi);
    let processId = undefined;

    logs.forEach(log => {
        try {
            const evt = productAbiCoder.decodeEvent(log.topics, log.data);
            console.log(evt);
            if (evt.name === 'LogDepegPolicyCreated') {
                // console.log(evt);
                // @ts-ignore
                processId = evt.values.policyId.toString();
            }
        } catch (e) {
            console.log(e);
        }
    });

    return processId;
}

export async function applyForDepegPolicy(
        contractAddress: string, 
        signer: Signer, 
        insuredAmount: number, 
        coverageDurationDays: number, 
        premium: number, 
        beforeWaitCallback?: () => void
        ): Promise<[ContractTransaction, ContractReceipt]> {
    const product = DepegProduct__factory.connect(contractAddress, signer);
    const tx = await product.applyForPolicy(
        insuredAmount, 
        coverageDurationDays * 24 * 60 * 60,
        premium);
    if (beforeWaitCallback) {
        beforeWaitCallback();
    }
    const receipt = await tx.wait();
    // console.log(receipt);
    return [tx, receipt];
}

export async function getPoliciesCount(
        ownerWalletAddress: string,
        depegProductContractAddress: string, 
        signer: Signer, 
        ): Promise<number> {
    const product = DepegProduct__factory.connect(depegProductContractAddress, signer);
    return (await product.processIds(ownerWalletAddress)).toNumber();        
}

export async function getPolicies(
        ownerWalletAddress: string,
        depegProductContractAddress: string, 
        signer: Signer, 
        ): Promise<Array<PolicyData>> {
    const [ product, riskpool, _, instanceService ] = await getInstanceFromProduct(depegProductContractAddress, signer);
    const numPolicies = (await product.processIds(ownerWalletAddress)).toNumber();

    const policies = new Array();
    
    for (let i = 0; i < numPolicies; i++) {
        const policy = await getPolicyForProduct(ownerWalletAddress, i, product, riskpool, instanceService);
        policies.push(policy);
    }

    return policies;
}


export async function getPolicy(
        ownerWalletAddress: string,
        idx: number,
        depegProductContractAddress: string, 
        signer: Signer, 
        ): Promise<PolicyData> {
    const [ product, riskpool, _, instanceService ] = await getInstanceFromProduct(depegProductContractAddress, signer);
    return getPolicyForProduct(ownerWalletAddress, idx, product, riskpool, instanceService);
}

async function getPolicyForProduct(
        ownerWalletAddress: string,
        idx: number,
        product: DepegProduct,
        riskpool: DepegRiskpool,
        instanceService: IInstanceService,
        ): Promise<PolicyData> {
    const processId = await product.getProcessId(ownerWalletAddress, idx);
    const application = await instanceService.getApplication(processId);
    const [ applicationState, premium, suminsured, appdata, createdAt ] = application;
    let policyState = undefined;
    if ( applicationState == APPLICATION_STATE_UNDERWRITTEN ) {
        const policy = await instanceService.getPolicy(processId);
        [ policyState ] = policy;
    }
    const [ duration ] = await riskpool.decodeApplicationParameterFromData(appdata);
    return {
        owner: ownerWalletAddress,
        processId: processId,
        applicationState: applicationState,
        policyState: policyState,
        createdAt: createdAt,
        premium: premium,
        suminsured: suminsured,
        duration: duration,
    } as PolicyData;
}


export enum PolicyState {
    UNKNOWN, APPLIED, REVOKED, UNDERWRITTEN, DECLINED,
    ACTIVE, EXPIRED, CLOSED,
}

export function getPolicyState(policy: PolicyData): PolicyState {
    switch (policy.applicationState) {
        case APPLICATION_STATE_APPLIED:
            return PolicyState.APPLIED;
        case APPLICATION_STATE_REVOKED:
            return PolicyState.REVOKED;
        case APPLICATION_STATE_UNDERWRITTEN:
            switch (policy.policyState) {
                case POLICY_STATE_ACTIVE:
                    if (moment().isAfter(getPolicyExpiration(policy))) {
                        return PolicyState.EXPIRED;
                    }
                    return PolicyState.ACTIVE;
                case POLICY_STATE_EXPIRED:
                    return PolicyState.EXPIRED;
                case POLICY_STATE_CLOSED:
                    return PolicyState.CLOSED;
                default:
                    return PolicyState.UNKNOWN;
            }
        case APPLICATION_STATE_DECLINED:
            return PolicyState.DECLINED;
        default:
            return PolicyState.UNKNOWN;
    }
    // TODO: payout states
}

function getPolicyExpiration(policy: PolicyData): Moment {
    return moment.unix(policy.createdAt.toNumber() + policy.duration.toNumber());
}

export function getPolicyEndDate(policy: PolicyData): string {
    return getPolicyExpiration(policy).startOf("day").format("YYYY-MM-DD");
}
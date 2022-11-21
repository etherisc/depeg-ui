import { Coder } from "abi-coder";
import DepegProductBuild from '@etherisc/depeg-contracts/build/contracts/DepegProduct.json';
import { ContractReceipt, ContractTransaction, Signer } from "ethers";
import { DepegProduct, DepegProduct__factory, DepegRiskpool } from "../../contracts/depeg-contracts";
import { getDepegRiskpool, getInstanceService } from "./gif_registry";
import { IInstanceService } from "../../contracts/gif-interface";
import { PolicyData } from "./policy_data";
import moment from "moment";

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

export async function getPolicies(
        ownerWalletAddress: string,
        depegProductContractAddress: string, 
        signer: Signer, 
        ): Promise<Array<PolicyData>> {
    const [ product, riskpool, _, instanceService ] = await getInstanceFromProduct(depegProductContractAddress, signer);
    const numPolicies = (await product.processIds(ownerWalletAddress)).toNumber();

    const policies = new Array();
    
    for (let i = 0; i < numPolicies; i++) {
        const processId = await product.getProcessId(ownerWalletAddress, i);
        const application = await instanceService.getApplication(processId);
        const [ state, premium, suminsured, appdata, createdAt ] = application;
        const [ duration, maxpremium ] = await riskpool.decodeApplicationParameterFromData(appdata);
        policies.push({
            owner: ownerWalletAddress,
            processId: processId,
            state: state,
            createdAt: createdAt,
            premium: premium,
            suminsured: suminsured,
            duration: duration,
            maxpremium: maxpremium,
        } as PolicyData);
    }

    return policies;
}

export function getPolicyState(policy: PolicyData): string {
    switch (policy.state) {
        // TODO correct states
        case 0: return "Pending";
        case 1: return "Approved";
        case 2: return "Rejected";
        case 3: return "Cancelled";
        case 4: return "Expired";
        case 5: return "Claimed";
        case 6: return "Paid";
        default: return "Unknown";
    }
}

export function getPolicyEndDate(policy: PolicyData): string {
    const endtimestamp = policy.createdAt.toNumber() + policy.duration.toNumber();
    return moment.unix(endtimestamp).startOf("day").format("YYYY-MM-DD");
}
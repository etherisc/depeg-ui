import { Coder } from "abi-coder";
import DepegProductBuild from '@etherisc/depeg-contracts/build/contracts/DepegProduct.json';
import { ContractReceipt, ContractTransaction, Signer } from "ethers";
import { DepegProduct__factory } from "../../contracts/depeg-contracts";

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
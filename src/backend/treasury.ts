import { ContractReceipt, ContractTransaction, Signer } from "ethers";
import { getErc20Token } from "./erc20";
import { getInstanceService } from "./gif_registry";

export async function createApprovalForTreasury(
        tokenAddress: string, 
        signer: Signer, 
        amount: number, 
        registryAddress: string, 
        beforeApprovalCallback?: (address: string, currency: string, amount: number) => void,
        beforeWaitCallback?: (address: string, currency: string, amount: number) => void
        ): Promise<[ContractTransaction, ContractReceipt]> {
    console.log(`creating treasury approval for ${amount} token ${tokenAddress}`);
    const usd1 = getErc20Token(tokenAddress, signer);
    const instanceService = await getInstanceService(registryAddress, signer);
    const treasury = await instanceService.getTreasuryAddress();
    console.log("treasury", treasury);
    if (beforeApprovalCallback !== undefined) {
        beforeApprovalCallback(treasury, "", amount); // TODO: currency symbol
    }
    const tx = await usd1.approve(treasury, amount);
    if (beforeWaitCallback !== undefined) {
        beforeWaitCallback(treasury, "", amount); // TODO: currency symbol
    }
    const receipt = await tx.wait();
    return [tx, receipt];
}
import { BigNumber, ContractReceipt, ContractTransaction, ethers, Signer } from "ethers";
import { ApprovalFailedError } from "../utils/error";
import { getErc20Token } from "./erc20";
import { getInstanceService } from "./gif_registry";

export async function createApprovalForTreasury(
        tokenAddress: string, 
        signer: Signer, 
        amount: BigNumber, 
        registryAddress: string, 
        beforeApprovalCallback?: (address: string, currency: string, amount: BigNumber) => void,
        beforeWaitCallback?: (address: string, currency: string, amount: BigNumber) => void
        ): Promise<[ContractTransaction, ContractReceipt]> {
    console.log(`creating treasury approval for ${amount} token ${tokenAddress}`);
    const usd1 = getErc20Token(tokenAddress, signer);
    const symbol = await usd1.symbol();
    const instanceService = await getInstanceService(registryAddress, signer);
    const treasury = await instanceService.getTreasuryAddress();
    console.log("treasury", treasury);
    if (beforeApprovalCallback !== undefined) {
        beforeApprovalCallback(treasury, symbol, amount); 
    }
    try {
        const tx = await usd1.approve(treasury, amount, { gasLimit: 100000 });
        console.log("tx done", tx)
        if (beforeWaitCallback !== undefined) {
            beforeWaitCallback(treasury, symbol, amount); 
        }
        const receipt = await tx.wait();
        console.log("wait done", receipt, tx)
        return [tx, receipt];
    } catch (e) {
        console.log("caught error during approval: ", e);
        // @ts-ignore e.code
        throw new ApprovalFailedError(e.code, e);
    }
}
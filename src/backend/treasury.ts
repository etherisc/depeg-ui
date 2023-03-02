import { BigNumber, ContractReceipt, ContractTransaction, ethers, Signer } from "ethers";
import { finish, start, waitingForTransaction, waitingForUser } from "../redux/slices/transaction";
import { store } from "../redux/store";
import { TrxType } from "../types/trxtype";
import { ApprovalFailedError } from "../utils/error";
import { formatCurrencyBN } from "../utils/numbers";
import { getErc20Token } from "./erc20";
import { getInstanceService } from "./gif_registry";

export async function createApprovalForTreasury(
        tokenAddress: string, 
        signer: Signer, 
        amount: BigNumber, 
        registryAddress: string, 
        ): Promise<[ContractTransaction, ContractReceipt]> {
    console.log(`creating treasury approval for ${amount} token ${tokenAddress}`);
    const usd1 = getErc20Token(tokenAddress, signer);
    const symbol = await usd1.symbol();
    const decimals = await usd1.decimals();
    const instanceService = await getInstanceService(registryAddress, signer);
    const treasury = await instanceService.getTreasuryAddress();
    console.log("treasury", treasury);
    store.dispatch(start({ type: TrxType.TOKEN_ALLOWANCE }));
    store.dispatch(waitingForUser({ active: true, params: { address: treasury, currency: symbol, amount: formatCurrencyBN(amount, decimals) }}));
    try {
        const tx = await usd1.approve(treasury, amount, { gasLimit: 100000 });
        console.log("tx done", tx)
            store.dispatch(waitingForTransaction({ active: true, params: { address: treasury }}));
        const receipt = await tx.wait();
        console.log("wait done", receipt, tx)
        return [tx, receipt];
    } catch (e) {
        console.log("caught error during approval: ", e);
        // @ts-ignore e.code
        throw new ApprovalFailedError(e.code, e);
    } finally {
        store.dispatch(finish());
    }
}
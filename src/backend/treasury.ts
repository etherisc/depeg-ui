import { BigNumber, ContractReceipt, ContractTransaction, Signer } from "ethers";
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
        ): Promise<{ tx: ContractTransaction|undefined, receipt: ContractReceipt|undefined, exists: Boolean }> {
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
        const allowanceExists = await usd1.allowance(await signer.getAddress(), treasury);
        if (allowanceExists.gte(amount)) {
            return { exists: true, tx: undefined, receipt: undefined };
        }
        const tx = await usd1.approve(treasury, amount, { gasLimit: 100000 });
        console.log("tx done", tx)
            store.dispatch(waitingForTransaction({ active: true, params: { address: treasury }}));
        const receipt = await tx.wait();
        console.log("wait done", receipt, tx)
        return { tx, receipt, exists: false };
    } catch (e) {
        console.log("caught error during approval: ", e);
        // @ts-ignore e.code
        throw new ApprovalFailedError(e.code, e);
    } finally {
        store.dispatch(finish());
    }
}
import { BigNumber } from "ethers";
import { formatCurrency, formatCurrencyBN } from "./numbers";

export function formatAmountBN(amount: BigNumber, tokenSymbol: string, tokenDecimals: number): string {
    return `${tokenSymbol} ${formatCurrencyBN(amount, tokenDecimals)}`;
}

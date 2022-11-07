import { BigNumber, ethers } from "ethers";

export function formatEthersNumber(num: BigNumber, decimals: number): string {
    const t = ethers.utils.formatEther(num);
    return (+t).toFixed(decimals);
}

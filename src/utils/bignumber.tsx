import { BigNumber, ethers } from "ethers";

export const formatEthersNumber = (num: BigNumber, decimals: number): string => {
    const t = ethers.utils.formatEther(num);
    return (+t).toFixed(decimals);
}

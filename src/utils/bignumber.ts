import { BigNumber, ethers } from "ethers";

export function formatEthersNumber(num: BigNumber, decimals: number): string {
    const t = ethers.utils.formatEther(num);
    return (+t).toFixed(decimals);
}

export function bigNumberComparator(v1: BigNumber, v2: BigNumber): number {
    if (v1.gt(v2)) {
        return 1;
    }

    if (v1.lt(v2)) {
        return -1;
    }

    return 0;
}

export function minBigNumber(v1: BigNumber, v2: BigNumber): BigNumber {
    return bigNumberComparator(v1, v2) < 0 ? v1 : v2;
}
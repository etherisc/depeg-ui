import { BigNumber } from "ethers";

export const isStakingSupported = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS !== undefined && process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS !== "";

export function calculateStakeUsage(capitalSupport: BigNumber | undefined, lockedCapital: BigNumber): number | undefined {
    if (capitalSupport !== undefined) {
        if (capitalSupport.gt(0)) {
            return lockedCapital.mul(100).div(capitalSupport).toNumber() / 100;
        } else {
            if (lockedCapital.gt(0)) {
                return 1;
            }
        }
    }
    return undefined;
}

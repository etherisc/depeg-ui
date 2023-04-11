import { BigNumber } from "ethers";

export type BundleData = {
    id: number;
    riskpoolId: number;
    owner: string;
    tokenId: number;
    apr: number;
    minProtectedAmount: string;
    maxProtectedAmount: string;
    minDuration: number;
    maxDuration: number;
    balance: string;
    capital: string;
    locked: string;
    // the amount of USD2 supported by staking of DIPs
    capitalSupport: string | undefined;
    // the amount of USD1 available for protection due to support of staking
    supportedCapacity: string | undefined;
    // the effecive amount of USD1 remaining available for protection (after deducting the amount of USD1 already used for protection)
    supportedCapacityRemaining: string | undefined;
    capacity: string;
    policies: number;
    state: number;
    createdAt: number;
    name: string;
    lifetime: string;
}

export const MAX_BUNDLE = 
{ 
    apr: 100, 
    minDuration: Number.MAX_SAFE_INTEGER, maxDuration: Number.MIN_SAFE_INTEGER + 1, 
    minProtectedAmount: BigNumber.from(Number.MAX_SAFE_INTEGER - 1).toString(), maxProtectedAmount: BigNumber.from(Number.MIN_SAFE_INTEGER + 1).toString()
} as BundleData;
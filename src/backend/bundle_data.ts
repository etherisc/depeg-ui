import { BigNumber } from "ethers";

export type BundleData = {
    id: number;
    riskpoolId: number;
    owner: string;
    tokenId: number;
    apr: number;
    minSumInsured: string;
    maxSumInsured: string;
    minDuration: number;
    maxDuration: number;
    balance: string;
    capital: string;
    locked: string;
    capitalSupport: string | undefined;
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
    minSumInsured: BigNumber.from(Number.MAX_SAFE_INTEGER - 1).toString(), maxSumInsured: BigNumber.from(Number.MIN_SAFE_INTEGER + 1).toString() 
} as BundleData;
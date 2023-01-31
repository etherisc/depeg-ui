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

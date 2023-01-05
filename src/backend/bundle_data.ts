import { BigNumber } from "ethers";

export type BundleData = {
    id: number;
    riskpoolId: number;
    owner: string;
    tokenId: number;
    apr: number;
    minSumInsured: number;
    maxSumInsured: number;
    minDuration: number;
    maxDuration: number;
    capital: number;
    locked: number;
    capacity: number;
    policies: number;
    state: number;
    createdAt: number;
    name: string;
    lifetime: string;
}

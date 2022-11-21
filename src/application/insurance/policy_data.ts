import { BigNumber } from "ethers/lib/ethers";
import { Bundle } from "typescript";

export interface PolicyData {
    owner: string
    processId: string;
    state: number;
    premium: BigNumber;
    suminsured: BigNumber;
    duration: BigNumber;
    maxpremium: BigNumber;
}

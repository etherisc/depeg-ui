import { BigNumber } from "ethers/lib/ethers";
import { Bundle } from "typescript";

export interface PolicyData {
    owner: string
    processId: string;
    applicationState: number;
    policyState?: number;
    // claimState: number;
    // payoutState: number;
    createdAt: BigNumber;
    premium: BigNumber;
    suminsured: BigNumber;
    duration: BigNumber;
}

export const APPLICATION_STATE_APPLIED = 0;
export const APPLICATION_STATE_REVOKED = 1;
export const APPLICATION_STATE_UNDERWRITTEN = 2;
export const APPLICATION_STATE_DECLINED = 3;

export const POLICY_STATE_ACTIVE = 0;
export const POLICY_STATE_EXPIRED = 1;
export const POLICY_STATE_CLOSED = 2;


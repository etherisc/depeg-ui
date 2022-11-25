import { BigNumber } from "ethers/lib/ethers";

export interface PolicyData {
    owner: string
    processId: string;
    applicationState: number;
    policyState?: number;
    payoutState?: number;
    createdAt: BigNumber;
    duration: BigNumber;
    premium: BigNumber;
    suminsured: BigNumber;
}

export const APPLICATION_STATE_APPLIED = 0;
export const APPLICATION_STATE_REVOKED = 1;
export const APPLICATION_STATE_UNDERWRITTEN = 2;
export const APPLICATION_STATE_DECLINED = 3;

export const POLICY_STATE_ACTIVE = 0;
export const POLICY_STATE_EXPIRED = 1;
export const POLICY_STATE_CLOSED = 2;

export const PAYOUT_STATE_EXPECTED = 0;
export const PAYOUT_STATE_PAIDOUT = 1;

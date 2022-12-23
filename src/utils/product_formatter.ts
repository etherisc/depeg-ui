import { PolicyData, APPLICATION_STATE_APPLIED, APPLICATION_STATE_REVOKED, APPLICATION_STATE_UNDERWRITTEN, APPLICATION_STATE_DECLINED, POLICY_STATE_ACTIVE, POLICY_STATE_EXPIRED, POLICY_STATE_CLOSED, PAYOUT_STATE_EXPECTED, PAYOUT_STATE_PAIDOUT, PolicyState } from "../backend/policy_data";
import dayjs from "dayjs";

export function getPolicyState(policy: PolicyData): PolicyState {
    switch (policy.applicationState) {
        case APPLICATION_STATE_APPLIED:
            return PolicyState.APPLIED;
        case APPLICATION_STATE_REVOKED:
            return PolicyState.REVOKED;
        case APPLICATION_STATE_UNDERWRITTEN:
            return getPolicyStateForActivePolicy(policy);
        case APPLICATION_STATE_DECLINED:
            return PolicyState.DECLINED;
        default:
            return PolicyState.UNKNOWN;
    }
}

export function getPolicyStateForActivePolicy(policy: PolicyData): PolicyState {
    switch (policy.policyState) {
        case POLICY_STATE_ACTIVE:
            if (dayjs().isAfter(getPolicyExpiration(policy))) {
                return PolicyState.EXPIRED;
            }
            if (policy.payoutState !== undefined) {
                return getPolicyStateForPaidoutPolicy(policy);
            }           
            return PolicyState.ACTIVE;
        case POLICY_STATE_EXPIRED:
            return PolicyState.EXPIRED;
        case POLICY_STATE_CLOSED:
            return PolicyState.CLOSED;
        default:
            return PolicyState.UNKNOWN;
    }
}


export function getPolicyStateForPaidoutPolicy(policy: PolicyData): PolicyState {
    switch (policy.payoutState) {
        case PAYOUT_STATE_EXPECTED:
            return PolicyState.PAYOUT_EXPECTED;
        case PAYOUT_STATE_PAIDOUT:
            return PolicyState.PAIDOUT;
        default:
            return PolicyState.UNKNOWN;
    }
}

export function getPolicyExpiration(policy: PolicyData): dayjs.Dayjs {
    return dayjs.unix(policy.createdAt.toNumber() + policy.duration.toNumber());
}

export function getPolicyEnd(policy: PolicyData): dayjs.Dayjs {
    return getPolicyExpiration(policy).startOf("day");
}
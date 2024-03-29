import { PolicyData, APPLICATION_STATE_APPLIED, APPLICATION_STATE_REVOKED, APPLICATION_STATE_UNDERWRITTEN, APPLICATION_STATE_DECLINED, POLICY_STATE_ACTIVE, POLICY_STATE_EXPIRED, POLICY_STATE_CLOSED, PAYOUT_STATE_EXPECTED, PAYOUT_STATE_PAIDOUT, PolicyState, APPLICATION_STATE_PENDING_MINING } from "../backend/policy_data";
import dayjs from "dayjs";

export function getPolicyState(policy: PolicyData): PolicyState {
    switch (policy.applicationState) {
        case APPLICATION_STATE_PENDING_MINING:
            return PolicyState.PENDING_MINING;
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
            const exp = getPolicyExpiration(policy);
            if (dayjs().isAfter(dayjs.unix(exp))) {
                return PolicyState.EXPIRED;
            }
            if (policy.isAllowedToClaim) {
                return PolicyState.CLAIMABLE;
            }
            return PolicyState.ACTIVE;
        case POLICY_STATE_EXPIRED:
            if (policy.payoutState !== undefined) {
                return getPolicyStateForPaidoutPolicy(policy);
            }           
            return PolicyState.EXPIRED;
        case POLICY_STATE_CLOSED:
            if (policy.payoutState !== undefined) {
                return getPolicyStateForPaidoutPolicy(policy);
            }           
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

export function getPolicyExpiration(policy: PolicyData): number {
    return dayjs.unix(policy.createdAt + policy.duration).unix();
}

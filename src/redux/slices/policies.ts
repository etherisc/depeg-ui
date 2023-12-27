import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { PolicyData } from '../../backend/policy_data';

export interface PoliciesState {
    policies: PolicyData[];
    claimedPolicy: PolicyData | null;
    isLoading: boolean;
    isDepegged: boolean;
}

export const INITIAL_POLICIES_STATE: PoliciesState = {
    policies: [],
    claimedPolicy: null,
    isLoading: false,
    isDepegged: false,
}

export const policiesSlice = createSlice({
    name: 'policies',
    initialState: INITIAL_POLICIES_STATE,
    reducers: {
        addPolicy: (state, action: PayloadAction<PolicyData>) => {
            if (action.payload.id !== '') { 
                // active policies have an id
                const hasPolicy = state.policies.find((p) => p.id === action.payload.id) !== undefined;
                if (!hasPolicy) {
                    state.policies.push(action.payload);
                }
            } else {
                // future policies based on a pending transaction need to be identified by createdAt and protectedWallet
                const hasPolicy = state.policies.find((p) => p.createdAt === action.payload.createdAt && p.protectedWallet === action.payload.protectedWallet) !== undefined;
                if (!hasPolicy) {
                    state.policies.push(action.payload);
                }
            }
        },
        reset: (state) => {
            state.policies = [];
        },
        startLoading: (state) => {
            state.isLoading = true;
        },
        finishLoading: (state) => {
            state.isLoading = false;
        },
        setDepegged: (state) => {
            state.isDepegged = true;
        },
        setClaimedPolicy: (state, action: PayloadAction<PolicyData|null>) => {
            state.claimedPolicy = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { 
    addPolicy, reset, 
    startLoading, finishLoading,
    setDepegged,
    setClaimedPolicy,
} = policiesSlice.actions;

export default policiesSlice.reducer;

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { PolicyData } from '../../backend/policy_data';

export interface PoliciesState {
    policies: PolicyData[];
    isLoading: boolean;
}

const initialState: PoliciesState = {
    policies: [],
    isLoading: false,
}

export const policiesSlice = createSlice({
    name: 'policies',
    initialState,
    reducers: {
        addPolicy: (state, action: PayloadAction<PolicyData>) => {
            const hasBundle = state.policies.find((p) => p.id === action.payload.id) !== undefined;
            if (!hasBundle) {
                state.policies.push(action.payload);
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
    },
});

// Action creators are generated for each case reducer function
export const { 
    addPolicy, reset, 
    startLoading, finishLoading,
} = policiesSlice.actions;

export default policiesSlice.reducer;

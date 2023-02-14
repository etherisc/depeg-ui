import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { BundleData } from '../../backend/bundle_data';

export interface ApplicationState {
    isLoadingBundles: boolean;
    bundles: BundleData[];
    applicableBundleIds: number[] | undefined;
    selectedBundleId: number | undefined;
    premium: string | undefined;
}

const initialState: ApplicationState = {
    bundles: [],
    isLoadingBundles: false,
    applicableBundleIds: undefined,
    selectedBundleId: undefined,
    premium: undefined,
}

export const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        addBundle: (state, action: PayloadAction<BundleData>) => {
            const hasBundle = state.bundles.find((bundle) => bundle.id === action.payload.id) !== undefined;
            if (!hasBundle) {
                state.bundles.push(action.payload);
            }
        },
        reset: (state) => {
            state.bundles = [];
            state.applicableBundleIds = undefined;
            state.selectedBundleId = undefined;
            state.premium = undefined;
        },
        startLoading: (state) => {
            state.isLoadingBundles = true;
        },
        finishLoading: (state) => {
            state.isLoadingBundles = false;
        },
        setApplicableBundleIds(state, action: PayloadAction<number[] | undefined>) {
            state.applicableBundleIds = action.payload;
        },
        setPremium(state, action: PayloadAction<[number|undefined, string|undefined]>) {
            state.selectedBundleId = action.payload[0];
            state.premium = action.payload[1];
        },
        clearPremium(state) {
            state.selectedBundleId = undefined;
            state.premium = undefined;
        },
    },
});

// Action creators are generated for each case reducer function
export const { 
    addBundle, reset, 
    startLoading, finishLoading,
    setApplicableBundleIds,
    setPremium, clearPremium,
} = applicationSlice.actions;

export default applicationSlice.reducer;

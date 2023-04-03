import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { BundleData } from '../../backend/bundle_data';
import { ComponentState } from '../../types/component_state';

export interface ApplicationState {
    productComponentState: ComponentState,
    isLoadingBundles: boolean;
    bundles: BundleData[];
    exampleRate: string;
    applicableBundleIds: number[] | undefined;
    selectedBundleId: number | undefined;
    premium: string | undefined;
    premiumErrorKey: string | undefined;
    premiumCalculationInProgress: boolean;
}

const initialState: ApplicationState = {
    productComponentState: ComponentState.Active,
    bundles: [],
    isLoadingBundles: false,
    exampleRate: "0.9",
    applicableBundleIds: undefined,
    selectedBundleId: undefined,
    premium: undefined,
    premiumErrorKey: undefined,
    premiumCalculationInProgress: false,
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
            state.exampleRate = "0.9";
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
            state.premiumErrorKey = undefined;
            state.premiumCalculationInProgress = false;
        },
        setPremiumErrorKey(state, action: PayloadAction<string|undefined>) {
            state.premiumErrorKey = action.payload;
        },
        setPremiumCalculationInProgress(state, action: PayloadAction<boolean>) {
            state.premiumCalculationInProgress = action.payload;
        },
        setProductComponentState(state, action: PayloadAction<ComponentState>) {
            state.productComponentState = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { 
    setProductComponentState,
    addBundle, reset, 
    startLoading, finishLoading,
    setApplicableBundleIds,
    setPremium, clearPremium,
    setPremiumErrorKey,
    setPremiumCalculationInProgress,
} = applicationSlice.actions;

export default applicationSlice.reducer;

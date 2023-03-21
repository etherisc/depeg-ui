import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { BundleData } from '../../backend/bundle_data';

export interface BundlesState {
    // the list of bundles to display
    bundles: BundleData[];
    // the maximum number of active bundles
    maxActiveBundles: number;
    // indicate if the bundles are loading
    isLoadingBundles: boolean;
    // if not undefined this will show the bundle details for the given bundle
    showBundle: BundleData | undefined;
    // show success dialog in bundle details page after bundle creation
    showCreationConfirmation: boolean;
    // if true this will show the withdraw dialog for the bundle
    isShowBundleWithdraw: boolean;
    // if true this will show the fund dialog for the bundle
    isShowBundleFund: boolean;
}

const initialState: BundlesState = {
    bundles: [],
    maxActiveBundles: 0,
    showBundle: undefined,
    showCreationConfirmation: false,
    isLoadingBundles: false,
    isShowBundleWithdraw: false,
    isShowBundleFund: false,
}

export const bundlesSlice = createSlice({
    name: 'bundles',
    initialState,
    reducers: {
        addBundle: (state, action: PayloadAction<BundleData>) => {
            const hasBundle = state.bundles.find((bundle) => bundle.id === action.payload.id) !== undefined;
            if (!hasBundle) {
                state.bundles.push(action.payload);
            }
        },
        updateBundle: (state, action: PayloadAction<BundleData>) => {
            const index = state.bundles.findIndex((bundle) => bundle.id === action.payload.id);
            if (index !== -1) {
                state.bundles[index] = action.payload;
                if (state.showBundle?.id === action.payload.id) {
                    state.showBundle = action.payload;
                }
            }
        },
        reset: (state) => {
            state.bundles = [];
        },
        startLoading: (state) => {
            state.isLoadingBundles = true;
        },
        finishLoading: (state) => {
            state.isLoadingBundles = false;
        },
        showBundle(state, action: PayloadAction<BundleData|undefined>) {
            state.showBundle = action.payload;
            state.isShowBundleFund = false;
            state.isShowBundleWithdraw = false;
            state.showCreationConfirmation = false;
        },
        showCreationConfirmation(state, action: PayloadAction<boolean>) {
            state.showCreationConfirmation = action.payload;
        },
        cleanup(state) {
            state.showBundle = undefined;
            state.isShowBundleWithdraw = false;
            state.isShowBundleFund = false;
        },
        showBundleWithdraw(state, action: PayloadAction<boolean>) {
            state.isShowBundleWithdraw = action.payload;
            state.isShowBundleFund = false;
        },
        showBundleFund(state, action: PayloadAction<boolean>) {
            state.isShowBundleFund = action.payload;
            state.isShowBundleWithdraw = false;
        },
        setMaxActiveBundles(state, action: PayloadAction<number>) {
            state.maxActiveBundles = action.payload;
        },
        resetNavigation(state) {
            state.isShowBundleWithdraw = false;
            state.isShowBundleFund = false;
            state.showCreationConfirmation = false;
            state.showBundle = undefined;
        }
    },
});

// Action creators are generated for each case reducer function
export const { 
    addBundle, updateBundle, reset, 
    setMaxActiveBundles,
    startLoading, finishLoading,
    showBundle,
    cleanup,
    showBundleWithdraw,
    showBundleFund,
    showCreationConfirmation,
    resetNavigation,
} = bundlesSlice.actions;

export default bundlesSlice.reducer;

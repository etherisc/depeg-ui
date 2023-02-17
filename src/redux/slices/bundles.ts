import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { BundleData } from '../../backend/bundle_data';

export interface BundlesState {
    bundles: BundleData[];
    isLoadingBundles: boolean;
    // if not undefined this will show the bundle details for the given bundle
    showBundle: BundleData | undefined;
    // if true this will show the withdraw dialog for the bundle
    isShowBundleWithdraw: boolean;
    // if true this will show the fund dialog for the bundle
    isShowBundleFund: boolean;
}

const initialState: BundlesState = {
    bundles: [],
    showBundle: undefined,
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
    },
});

// Action creators are generated for each case reducer function
export const { 
    addBundle, updateBundle, reset, 
    startLoading, finishLoading,
    showBundle,
    cleanup,
    showBundleWithdraw,
    showBundleFund,
} = bundlesSlice.actions;

export default bundlesSlice.reducer;

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { BundleData } from '../../backend/bundle_data';

export interface BundlesState {
    bundles: BundleData[];
    showBundle: BundleData | undefined;
    isLoadingBundles: boolean;
}

const initialState: BundlesState = {
    bundles: [],
    showBundle: undefined,
    isLoadingBundles: false,
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
        },
    },
});

// Action creators are generated for each case reducer function
export const { 
    addBundle, updateBundle, reset, 
    startLoading, finishLoading,
    showBundle,
    cleanup,
} = bundlesSlice.actions;

export default bundlesSlice.reducer;

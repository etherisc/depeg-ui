import { AnyAction } from "@reduxjs/toolkit";
import { ethers, providers, Signer } from "ethers";
import React, { Dispatch } from "react";
import { BundleData } from "../backend/bundle_data";
import { disconnectChain } from "../redux/slices/chain_slice";
import { expectedChain } from "../utils/const";
import { toHex } from "../utils/numbers";

export interface AppContext {
    data: AppData;
    dispatch: React.Dispatch<AppAction>;
}

export interface AppData {
    bundles: Array<BundleData>;
    bundlesLoading: boolean;
    bundlesInitialized: boolean;
}

export const AppContext = React.createContext<AppContext>({ data: initialAppData(), dispatch: () => {} });
AppContext.displayName = "AppContext";

export function initialAppData(): AppData {
    return {
        bundles: new Array<BundleData>(),
        bundlesInitialized: false,
        bundlesLoading: false,
    };
}

export enum AppActionType {
    ADD_BUNDLE,
    RESET_BUNDLE,
    BUNDLE_INITIALIZING,
    BUNDLE_LOADING_FINISHED,
}

export interface AppAction {
    type: AppActionType;
    signer?: Signer;
    provider?: providers.Web3Provider;
    bundle?: BundleData;
    bundleLoading?: boolean;
    chainId?: string;
}

export function signerReducer(state: AppData, action: AppAction): AppData {
    switch (action.type) {
        case AppActionType.ADD_BUNDLE:
            if (state.bundles.find(b => b.id === action.bundle?.id) !== undefined) {
                return state;
            }
            return {
                ...state,
                bundles: state.bundles.concat(action.bundle!!)
            };
        case AppActionType.RESET_BUNDLE:
            return {
                ...state,
                bundles: new Array()
            };
        case AppActionType.BUNDLE_INITIALIZING:
            return {
                ...state, 
                bundlesInitialized: true,
                bundlesLoading: true
            }
        case AppActionType.BUNDLE_LOADING_FINISHED:
            return {
                ...state,
                bundlesLoading: false
            };
        default:
            throw Error("unxpected action type " + action.type);
    }
}


import { ethers, providers, Signer } from "ethers";
import React, { Dispatch } from "react";
import { BundleData } from "../backend/bundle_data";

export interface AppContext {
    data: AppData;
    dispatch: React.Dispatch<AppAction>;
}

export interface AppData {
    chainId: number;
    provider: providers.Web3Provider | undefined;
    signer: Signer | undefined;
    bundles: Array<BundleData>;
    bundlesLoading: boolean;
    bundlesInitialized: boolean;
}

export const AppContext = React.createContext<AppContext>({ data: initialAppData(), dispatch: () => {} });
AppContext.displayName = "AppContext";

export function initialAppData(): AppData {
    return {
        chainId: 0,
        provider: undefined,
        signer: undefined,
        bundles: new Array<BundleData>(),
        bundlesInitialized: false,
        bundlesLoading: false,
    };
}

export enum AppActionType {
    SET,
    UNSET,
    UPDATE_SIGNER,
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
}

export function signerReducer(state: AppData, action: AppAction): AppData {
    switch (action.type) {
        case AppActionType.SET:
            return { 
                ...state,
                chainId: action?.provider?.network !== undefined ? action?.provider?.network.chainId : 0,
                provider: action?.provider,
                signer: action?.signer,
            };
        case AppActionType.UNSET:
            return { 
                ...state,
                chainId: 0,
                provider: undefined,
                signer: undefined,
            };
        case AppActionType.UPDATE_SIGNER:
            return {
                ...state,
                signer: action?.signer,
            };
        case AppActionType.ADD_BUNDLE:
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

export function setSigner(dispatch: Dispatch<AppAction>, provider: ethers.providers.Web3Provider) {
    const signer = provider.getSigner();  
    console.log("set signer", signer);
    dispatch({ type: AppActionType.SET, signer: signer, provider: provider });
}

export function updateSigner(dispatch: Dispatch<AppAction>, provider: ethers.providers.Web3Provider) {
    const signer = provider.getSigner();  
    console.log("update signer", signer);
    dispatch({ type: AppActionType.UPDATE_SIGNER, signer: signer });
}

export function removeSigner(dispatch: Dispatch<AppAction>) {
    dispatch({ type: AppActionType.UNSET });
    console.log("unset signer");
    window.localStorage.clear();
}

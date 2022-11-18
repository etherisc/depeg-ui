import { ethers, providers, Signer } from "ethers";
import React, { Dispatch } from "react";
import { BundleData } from "../application/insurance/bundle_data";

export interface SignerContext {
    data: SignerData;
    dispatch: React.Dispatch<SignerAction>;
}

export interface SignerData {
    provider: providers.Web3Provider | undefined;
    signer: Signer | undefined;
    bundles: Array<BundleData>;
    bundlesLoading: boolean;
    bundlesInitialized: boolean;
}

export const SignerContext = React.createContext<SignerContext>({ data: initialSignerData(), dispatch: () => {} });
SignerContext.displayName = "SignerContext";

export function initialSignerData(): SignerData {
    return {
        provider: undefined,
        signer: undefined,
        bundles: new Array<BundleData>(),
        bundlesInitialized: false,
        bundlesLoading: false,
    };
}

export enum SignerActionType {
    SET,
    UNSET,
    UPDATE_SIGNER,
    ADD_BUNDLE,
    RESET_BUNDLE,
    BUNDLE_INITIALIZING,
    BUNDLE_LOADING_FINISHED,
}

export interface SignerAction {
    type: SignerActionType;
    signer?: Signer;
    provider?: providers.Web3Provider;
    bundle?: BundleData;
    bundleLoading?: boolean;
}

export function signerReducer(state: SignerData, action: SignerAction): SignerData {
    switch (action.type) {
        case SignerActionType.SET:
            return { 
                ...state,
                provider: action?.provider,
                signer: action?.signer,
            };
        case SignerActionType.UNSET:
            return { 
                ...state,
                provider: undefined,
                signer: undefined,
            };
        case SignerActionType.UPDATE_SIGNER:
            return {
                ...state,
                signer: action?.signer,
            };
        case SignerActionType.ADD_BUNDLE:
            return {
                ...state,
                bundles: state.bundles.concat(action.bundle!!)
            };
        case SignerActionType.RESET_BUNDLE:
            return {
                ...state,
                bundles: new Array()
            };
        case SignerActionType.BUNDLE_INITIALIZING:
            return {
                ...state, 
                bundlesInitialized: true,
                bundlesLoading: true
            }
        case SignerActionType.BUNDLE_LOADING_FINISHED:
            return {
                ...state,
                bundlesLoading: false
            };
        default:
            throw Error("unxpected action type " + action.type);
    }
}

export function setSigner(dispatch: Dispatch<SignerAction>, provider: ethers.providers.Web3Provider) {
    const signer = provider.getSigner();  
    console.log("set signer", signer);
    dispatch({ type: SignerActionType.SET, signer: signer, provider: provider });
}

export function updateSigner(dispatch: Dispatch<SignerAction>, provider: ethers.providers.Web3Provider) {
    const signer = provider.getSigner();  
    console.log("update signer", signer);
    dispatch({ type: SignerActionType.UPDATE_SIGNER, signer: signer });
}

export function removeSigner(dispatch: Dispatch<SignerAction>) {
    dispatch({ type: SignerActionType.UNSET });
    console.log("unset signer");
    window.localStorage.clear();
}

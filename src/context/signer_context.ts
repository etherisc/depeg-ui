import { ethers, providers, Signer } from "ethers";
import React, { Dispatch } from "react";

export interface SignerContext {
    data: SignerData;
    dispatch: React.Dispatch<SignerAction>;
}

export interface SignerData {
    provider: providers.Web3Provider | undefined;
    signer: Signer | undefined;
}

export const SignerContext = React.createContext<SignerContext|undefined>(undefined);

export function initialSignerData(): SignerData {
    return {
        provider: undefined,
        signer: undefined,
    };
}

export enum SignerActionType {
    SET,
    UNSET,
    UPDATE_SIGNER
}

export interface SignerAction {
    type: SignerActionType;
    signer?: Signer;
    provider?: providers.Web3Provider;
}

export function signerReducer(state: SignerData, action: SignerAction): SignerData {
    switch (action.type) {
        case SignerActionType.SET:
            return { 
                provider: action?.provider,
                signer: action?.signer,
            };
        case SignerActionType.UNSET:
            return { 
                provider: undefined,
                signer: undefined,
            };
        case SignerActionType.UPDATE_SIGNER:
            return {
                ...state,
                signer: action?.signer,
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

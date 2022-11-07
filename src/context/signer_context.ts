import { providers, Signer } from "ethers";
import React from "react";

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

export const signerReducer = (state: SignerData, action: SignerAction): SignerData => {
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
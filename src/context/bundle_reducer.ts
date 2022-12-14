import { BundleData } from "../backend/bundle_data";

export type BundleState = {
    bundles: Array<BundleData>,
    loading: boolean,
}

export enum BundleActionType {
    ADD,
    RESET,
    START_LOADING,
    STOP_LOADING,
}

export interface BundleAction {
    type: BundleActionType;
    bundle?: BundleData;
}

export function bundleReducer(state: BundleState, action: BundleAction): BundleState {
    console.log("bundleReducer", "actiontype", action.type);
    switch (action.type) {
        case BundleActionType.START_LOADING:
            return { ...state, loading: true };
        case BundleActionType.STOP_LOADING:
            return { ...state, loading: false };
        case BundleActionType.ADD:
            if (state.bundles.find(b => b.id === action.bundle?.id) !== undefined) {
                return state;
            }
            return { ...state, bundles: [...state.bundles, action.bundle!] };
        case BundleActionType.RESET:
            return { ...state, bundles: new Array<BundleData>() };
        default:
            throw Error("unxpected action type " + action.type);
    }
}


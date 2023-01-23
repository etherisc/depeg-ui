import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { providers, Signer } from 'ethers';

export interface ChainState {
    chainId: string,
    isConnected: boolean,
    isExpectedChain: boolean,
    provider?: providers.Web3Provider | undefined,
    signer?: Signer | undefined,
    blockNumber: number,
    blockTime: number,
}

const initialState: ChainState = {
    chainId: "0x0",
    isConnected: false,
    isExpectedChain: true,
    provider: undefined,
    signer: undefined,
    blockNumber: 0,
    blockTime: 0,
}

export const chainSlice = createSlice({
    name: 'chain',
    initialState,
    reducers: {
        connectChain(state, action: PayloadAction<ChainState>) {
            state.provider?.removeAllListeners();
            Object.assign(state, action.payload);
        },
        disconnectChain(state) {
            state.provider?.removeAllListeners();
            Object.assign(state, initialState);
        },
        updateSigner(state, action: PayloadAction<Signer>) {
            state.signer = action.payload;
        },
        setBlock: (state, action: PayloadAction<[number, number]>) => {
            if (action.payload[0] <= state.blockNumber) {
                return;
            }
            state.blockNumber = action.payload[0]
            state.blockTime = action.payload[1]
        },
    },
});

// Action creators are generated for each case reducer function
export const { 
    connectChain, disconnectChain, 
    updateSigner, 
    setBlock 
} = chainSlice.actions;

export default chainSlice.reducer;


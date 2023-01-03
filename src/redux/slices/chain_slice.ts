import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { BigNumber } from 'ethers';

export interface ChainState {
    blockNumber: number,
    blockTime: number,
}

const initialState: ChainState = {
    blockNumber: 0,
    blockTime: 0,
}

export const chainSlice = createSlice({
    name: 'chain',
    initialState,
    reducers: {
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
export const { setBlock } = chainSlice.actions;

export default chainSlice.reducer;

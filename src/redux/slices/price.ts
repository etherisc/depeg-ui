import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { calculatePriceInfo } from '../../utils/price';
import Timestamp from '../../components/timestamp';
import { BigNumber } from 'ethers';
import { parseUnits } from '@ethersproject/units';

export type PriceState = {
    symbol: string,
    name: string,
    decimals: number,
    address: string,
    latest: PriceInfo,
    history: Array<PriceInfo>,
    depegParameters: DepegParameters,
}

const initialPrice = {
    price: parseUnits("1.0", 8).toString(),
    timestamp: new Date().getMilliseconds(),
} as PriceInfo;


const initialState: PriceState = {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    decimals: 8,
    latest: initialPrice,
    history: [], // no initial history
    // TODO: get from config
    depegParameters: {
        decimals: 8,
        triggerPrice: "0.995",
        recoveryPrice: "0.999",
        recoveryWindow: 24 * 60 * 60, // one day
    }
}

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setCoin: (state, action: PayloadAction<{ symbol: string, name: string, decimals: number, address: string}>) => {
            state.symbol = action.payload.symbol;
            state.name = action.payload.name;
            state.address = action.payload.address;
            state.decimals = action.payload.decimals;
        },
        addPrice: (state, action: PayloadAction<PriceInfo>) => {
            state.latest = action.payload;
            state.history.push(action.payload);
        },
        addNewPrice: (state, action: PayloadAction<{ price: string, timestamp: Timestamp }>) => {
            const priceInfo = calculatePriceInfo(state.latest, action.payload, state.depegParameters);
            state.latest = priceInfo;
            state.history.push(priceInfo);
        },
    },
});

// Action creators are generated for each case reducer function
export const { 
    setCoin,
    addPrice,
} = accountSlice.actions;

export default accountSlice.reducer;


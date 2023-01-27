import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { parseUnits } from '@ethersproject/units';
import { PriceFeedState } from '../../types/price_feed_state';

export type PriceState = {
    symbol: string,
    name: string,
    decimals: number,
    address: string,
    latest: PriceInfo,
    triggeredAt: number,
    depeggedAt: number,
    history: Array<PriceInfo>,
    historyLoading: boolean,
    depegParameters: DepegParameters,
    noUpdates: boolean,
}

const initialPrice = {
    roundId: "0",
    price: parseUnits("0.0", 8).toString(),
    timestamp: 0,
} as PriceInfo;


const initialState: PriceState = {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    decimals: 8,
    latest: initialPrice,
    triggeredAt: 0,
    depeggedAt: 0,
    history: [], // no initial history
    historyLoading: false,
    // TODO: get from config
    depegParameters: {
        decimals: 8,
        triggerPrice: "0.995",
        recoveryPrice: "0.999",
        recoveryWindow: 24 * 60 * 60, // one day
    },
    noUpdates: false,
}

export const priceSlice = createSlice({
    name: 'price',
    initialState,
    reducers: {
        setCoin: (state, action: PayloadAction<{ symbol: string, name: string, decimals: number, address: string}>) => {
            state.symbol = action.payload.symbol;
            state.name = action.payload.name;
            state.address = action.payload.address;
            state.decimals = action.payload.decimals;
        },
        addPrice: (state, action: PayloadAction<PriceInfo>) => {
            // update latest price if newer price
            if (action.payload.roundId > state.latest.roundId) {
                state.latest = action.payload;
            }

            // check if roundid exists in history and insert if not
            const index = state.history.findIndex((p) => p.roundId === action.payload.roundId);
            if (index === -1) {
                const nextRoundIndex = state.history.findIndex((p) => action.payload.roundId < p.roundId );
                if (nextRoundIndex === -1) {
                    state.history.push(action.payload);
                } else {
                    state.history.splice(nextRoundIndex, 0, action.payload);
                }
            }
        },
        historyLoading: (state) => {
            state.historyLoading = true;
        },
        historyLoadingFinished: (state) => {
            state.historyLoading = false;
        },
        loadPriceFeedHistory: (state, action: PayloadAction<PriceInfo[]>) => {
            state.history = action.payload;
            state.latest = action.payload[action.payload.length - 1];
            state.noUpdates = true;
        },
        setTriggeredAt: (state, action: PayloadAction<number>) => {
            state.triggeredAt = action.payload;
        },
        setDepeggedAt: (state, action: PayloadAction<number>) => {  
            state.depeggedAt = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { 
    setCoin,
    addPrice,
    historyLoading,
    historyLoadingFinished,
    loadPriceFeedHistory,
    setTriggeredAt,
    setDepeggedAt,
} = priceSlice.actions;

export default priceSlice.reducer;


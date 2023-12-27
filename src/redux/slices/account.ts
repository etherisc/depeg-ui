import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Amount } from '../../types/amount';
import { fetchBalances } from '../thunks/account';

export interface AccountState {
    address: string | undefined,
    balance: Amount,
    balanceUsd1: Amount,
    balanceUsd2: Amount,
}

const emptyEth = {
    amount: "0",
    currency: "ETH",
    decimals: 18,
};
const emptyUsd = {
    amount: "0",
    currency: "USD",
    decimals: 6,
};

export const INITIAL_ACCOUNT_STATE: AccountState = {
    address: undefined,
    balance: emptyEth,
    balanceUsd1: emptyUsd,
    balanceUsd2: emptyUsd,
}

export const accountSlice = createSlice({
    name: 'account',
    initialState: INITIAL_ACCOUNT_STATE,
    reducers: {
        setAccount(state, action: PayloadAction<string>) {
            state.address = action.payload;
        },
        resetAccount(state) {
            state.address = undefined;
            state.balance = emptyEth;
            state.balanceUsd1 = emptyUsd;
            state.balanceUsd2 = emptyUsd;
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchBalances.fulfilled, (state, action) => {
            // Add user to the state array
            state.balance = action.payload[0];
            state.balanceUsd1 = action.payload[1];
            state.balanceUsd2 = action.payload[2];
        })
    },
});

// Action creators are generated for each case reducer function
export const { 
    setAccount, resetAccount,
} = accountSlice.actions;

export default accountSlice.reducer;


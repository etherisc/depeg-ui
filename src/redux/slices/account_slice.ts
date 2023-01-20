import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Amount } from '../../types/amount';

export interface AccountState {
    address: string | undefined,
    balance: Amount | undefined,
}

const initialState: AccountState = {
    address: undefined,
    balance: undefined,
}

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setAccount(state, action: PayloadAction<[string, string, string, number]>) {
            state.address = action.payload[0];
            state.balance = {
                amount: action.payload[1],
                currency: action.payload[2],
                decimals: action.payload[3]
            } as Amount;
        },
        updateBalance(state, action: PayloadAction<[string, string, number]>) {
            state.balance = {
                amount: action.payload[0],
                currency: action.payload[1],
                decimals: action.payload[2]
            } as Amount;
        },
        resetAccount(state) {
            state.address = undefined;
            state.balance = undefined;
        }
    },
});

// Action creators are generated for each case reducer function
export const { 
    setAccount, resetAccount,
    updateBalance
} = accountSlice.actions;

export default accountSlice.reducer;


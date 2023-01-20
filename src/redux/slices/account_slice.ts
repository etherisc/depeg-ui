import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Amount } from '../../types/amount';

export interface AccountState {
    account: string | undefined,
    balance: Amount | undefined,
}

const initialState: AccountState = {
    account: undefined,
    balance: undefined,
}

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setAccount(state, action: PayloadAction<[string, string, string, number]>) {
            state.account = action.payload[0];
            state.balance = {
                amount: action.payload[1],
                currency: action.payload[2],
                decimals: action.payload[3]
            } as Amount;
        },
        resetAccount(state) {
            state.account = undefined;
            state.balance = undefined;
        }
    },
});

// Action creators are generated for each case reducer function
export const { 
    setAccount, resetAccount
} = accountSlice.actions;

export default accountSlice.reducer;


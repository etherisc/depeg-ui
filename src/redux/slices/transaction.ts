import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { TrxType } from '../../types/trxtype';

export interface TransactionState {
    isActive: TrxType | null;
    isWaitingForUser: boolean;
    waitingForUserParams: any;
    isWaitingForTransaction: boolean;
    waitingForTransactionParams: any;
}

const initialState: TransactionState = {
    isActive: null,
    isWaitingForUser: false,
    waitingForUserParams: {},
    isWaitingForTransaction: false,
    waitingForTransactionParams: {},
}

export const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        start: (state, action: PayloadAction<{ type?: TrxType }>) => {
            console.log('start', action.payload.type);
            state.isActive = action.payload.type !== undefined ? action.payload.type : null;
        },
        finish: (state) => {
            state.isActive = null;
            state.isWaitingForUser = false;
            state.waitingForUserParams = {};
            state.isWaitingForTransaction = false;
            state.waitingForTransactionParams = {};
        },
        // waiting for user to sign a transaction in the wallet
        waitingForUser: (state, action: PayloadAction<{ active: boolean, params?: any }>) => {
            console.log('waitingForUser', action.payload.active, action.payload.params);
            state.isWaitingForUser = action.payload.active;
            state.waitingForUserParams = action.payload.params || {};
        },
        // waiting for transaction to be mined
        waitingForTransaction: (state, action: PayloadAction<{ active: boolean, params?: any }>) => {
            state.isWaitingForUser = false;
            state.waitingForUserParams = {};
            console.log('waitingForTransaction', action.payload.active, action.payload.params);
            state.isWaitingForTransaction = action.payload.active;
            state.waitingForTransactionParams = action.payload.params || {};
        },
    },  
});

// Action creators are generated for each case reducer function
export const { 
    start,
    finish,
    waitingForUser,
    waitingForTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;


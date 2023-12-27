import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import type { RenderOptions } from '@testing-library/react'
import { render } from '@testing-library/react'
import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { AccountState, INITIAL_ACCOUNT_STATE } from '../../src/redux/slices/account'
import { ApplicationState, INITIAL_APPLICATION_STATE } from '../../src/redux/slices/application'
import { BundlesState, INITIAL_BUNDLES_STATE } from '../../src/redux/slices/bundles'
import { ChainState, INITIAL_CHAIN_STATE } from '../../src/redux/slices/chain'
import { INITIAL_POLICIES_STATE, PoliciesState } from '../../src/redux/slices/policies'
import { INITIAL_PRICE_STATE, PriceState } from '../../src/redux/slices/price'
import { INITIAL_TRANSACTION_STATE } from '../../src/redux/slices/transaction'
import { AppStore, RootState, setupStore } from '../../src/redux/store'


// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: RootState
    store?: AppStore
}

export const EMPTY_ROOT_STATE: RootState = {
    account: INITIAL_ACCOUNT_STATE,
    application: INITIAL_APPLICATION_STATE,
    bundles: INITIAL_BUNDLES_STATE,
    chain: INITIAL_CHAIN_STATE,
    policies: INITIAL_POLICIES_STATE,
    price: INITIAL_PRICE_STATE,
    transaction: INITIAL_TRANSACTION_STATE,
};

export function renderWithProviders(
    ui: React.ReactElement,
    {
        preloadedState = EMPTY_ROOT_STATE,
        // Automatically create a store instance if no store was passed in
        store = setupStore(preloadedState),
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
        return (
            <Provider store={store}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {children}
                </LocalizationProvider>
            </Provider>
        );
    }
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
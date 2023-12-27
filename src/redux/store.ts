import { combineReducers, configureStore } from '@reduxjs/toolkit';
import accountReducer from './slices/account';
import applicationReducer from './slices/application';
import bundlesReducer from './slices/bundles';
import chainReducer from './slices/chain';
import policiesReducer from './slices/policies';
import priceReducer from './slices/price';
import transactionReducer from './slices/transaction';

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
    account: accountReducer,
    application: applicationReducer,
    bundles: bundlesReducer,
    chain: chainReducer,
    policies: policiesReducer,
    price: priceReducer,
    transaction: transactionReducer,
})

export const setupStore = (preloadedState?: RootState) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState
    })
}

export const store = setupStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch'];

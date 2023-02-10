import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';
import chainReducer from './slices/chain';
import applicationReducer from './slices/application';
import bundlesReducer from './slices/bundles';
import accountReducer from './slices/account';
import policiesReducer from './slices/policies';
import priceReducer from './slices/price';

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
    chain: chainReducer,
    account: accountReducer,
    application: applicationReducer,
    bundles: bundlesReducer,
    policies: policiesReducer,
    price: priceReducer,
})

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
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

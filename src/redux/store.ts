import { configureStore } from '@reduxjs/toolkit';
import chainReducer from './slices/chain';
import bundlesReducer from './slices/bundles';
import accountReducer from './slices/account';
import policiesReducer from './slices/policies';
import priceReducer from './slices/price';

export const store = configureStore({
    reducer: {
        chain: chainReducer,
        account: accountReducer,
        bundles: bundlesReducer,
        policies: policiesReducer,
        price: priceReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

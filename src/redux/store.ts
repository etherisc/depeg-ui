import { configureStore } from '@reduxjs/toolkit';
import chainReducer from './slices/chain';
import applicationReducer from './slices/application';
import bundlesReducer from './slices/bundles';
import accountReducer from './slices/account';
import policiesReducer from './slices/policies';
import priceReducer from './slices/price';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

export const store = configureStore({
    reducer: {
        chain: chainReducer,
        account: accountReducer,
        application: applicationReducer,
        bundles: bundlesReducer,
        policies: policiesReducer,
        price: priceReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

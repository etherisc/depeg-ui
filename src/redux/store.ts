import { configureStore } from '@reduxjs/toolkit';
import chainReducer from './slices/chain_slice';

export const store = configureStore({
    reducer: {
        chain: chainReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

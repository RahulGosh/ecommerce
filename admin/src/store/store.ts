import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/adminSlice"
import { adminApi } from "./api/adminApi";
import { productApi } from "./api/productApi";
import { orderApi } from "./api/orderApi";

export const appStore = configureStore({
  reducer: {
    auth: authReducer, // Combine auth reducer with key 'auth'
    [adminApi.reducerPath]: adminApi.reducer, // Integrate API reducer
    [productApi.reducerPath]: productApi.reducer, // Integrate API reducer
    [orderApi.reducerPath]: orderApi.reducer, // Integrate API reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware, productApi.middleware, orderApi.middleware),
});

const initializeApp = async () => {
  await appStore.dispatch(adminApi.endpoints.loadAdmin.initiate(undefined, { forceRefetch: true }));
}

initializeApp()

// Define RootState and AppDispatch types for type safety
export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;

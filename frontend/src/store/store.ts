import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"
import searchReducer from "../store/slices/searchSlice"
import cartReducer from "../store/slices/cartSlice"
import { authApi } from "./api/authApi";
import { productApi } from "./api/productApi";
import { cartApi } from "./api/cartApi";

export const appStore = configureStore({
  reducer: {
    auth: authReducer, // Combine auth reducer with key 'auth'
    search: searchReducer,
    cart: cartReducer,
    [authApi.reducerPath]: authApi.reducer, // Integrate API reducer
    [productApi.reducerPath]: productApi.reducer, // Integrate API reducer
    [cartApi.reducerPath]: cartApi.reducer, // Integrate API reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, productApi.middleware, cartApi.middleware),
});

const initializeApp = async () => {
  await appStore.dispatch(authApi.endpoints.loadUser.initiate(undefined, { forceRefetch: true }));
}

initializeApp()

// Define RootState and AppDispatch types for type safety
export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;

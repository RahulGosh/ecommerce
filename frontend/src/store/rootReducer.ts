// store.ts
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"
import { authApi } from "./api/authApi";
import { productApi } from "./api/productApi";
import { cartApi } from "./api/cartApi";

const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

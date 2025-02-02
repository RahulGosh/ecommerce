import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/adminSlice"
import { adminApi } from "./api/adminApi";
import { productApi } from "./api/productApi";
import { orderApi } from "./api/orderApi";

const rootReducer = combineReducers({
  auth: authReducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AddToCartPayload, CartResponse, RemoveCartPayload, UpdateCartPayload } from "../../types/types";

const Admin_API = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

export const cartApi = createApi({
  reducerPath: "cartApi",
  tagTypes: ["Cart"],
  baseQuery: fetchBaseQuery({
    baseUrl: Admin_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    addToCart: builder.mutation<CartResponse, AddToCartPayload>({
      query: ({ productId, size }) => ({
        url: `/add-to-cart/${productId}`,
        method: "POST",
        body: {size}
      }),
      invalidatesTags: [{ type: "Cart" }],
    }),

    getUserCart: builder.query<CartResponse, void>({
      query: () => ({
        url: "/getUserCart", // The backend endpoint
        method: "POST",
      }),
      providesTags: [{ type: "Cart" }],
    }),

    updateCart: builder.mutation<CartResponse, UpdateCartPayload>({
      query: ({ productId, size, quantity }) => ({
        url: `/update-cart/${productId}`,
        method: "PUT",
        body: { size, quantity },
      }),
      invalidatesTags: [{ type: "Cart" }],
    }),

    removeCart: builder.mutation<CartResponse, RemoveCartPayload>({
      query: ({ productId, size }) => ({
        url: `/remove-item/${productId}`,
        method: "DELETE",
        body: { size },
      }),
      invalidatesTags: [{ type: "Cart" }],
    }),
  }),
});

export const { useAddToCartMutation, useGetUserCartQuery, useUpdateCartMutation, useRemoveCartMutation } = cartApi;

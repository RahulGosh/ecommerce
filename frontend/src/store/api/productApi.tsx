import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AddProductResponse,
  ProductType,
  RemoveProductResponse,
  SingleProductRespons,
} from "../../types/types";

const Admin_API = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

export const productApi = createApi({
  reducerPath: "productApi",
  tagTypes: ["Products"],
  baseQuery: fetchBaseQuery({
    baseUrl: Admin_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    addProduct: builder.mutation<AddProductResponse, FormData>({
      query: (formData) => ({
        url: "add-product",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Products" }],
    }),

    getAllProducts: builder.query<ProductType, void>({
      query: () => ({
        url: "products",
        method: "GET",
      }),
      providesTags: [{ type: "Products" }],
      keepUnusedDataFor: 0, // Remove cached data immediately
    }),

    latestCollection: builder.query<ProductType, void>({
      query: () => ({
        url: "latest-products-collection",
        method: "GET",
      }),
      providesTags: [{ type: "Products" }],
    }),

    getSingleProduct: builder.query<SingleProductRespons, string>({
      query: (productId) => ({
        url: `product/${productId}`,
        method: "GET",
      }),
      providesTags: [{ type: "Products" }],
    }),

    removeProduct: builder.mutation<
      RemoveProductResponse,
      { productId: string }
    >({
      query: ({ productId }) => ({
        url: "remove-product",
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: [{ type: "Products" }],
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useRemoveProductMutation,
  useLatestCollectionQuery
} = productApi;

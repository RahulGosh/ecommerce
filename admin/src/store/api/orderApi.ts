import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Order, OrderResponse, UpdateStatusForCODPayload, UpdateStatusForCODResponse, UpdateStatusPayload, UpdateStatusResponse } from "../../types/types";

const Order_Api = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

export const orderApi = createApi({
    reducerPath: "orderApi",
    tagTypes: ["REFETCH_ORDER_API"],
    baseQuery: fetchBaseQuery({
        baseUrl: Order_Api,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        getAllOrders: builder.query<OrderResponse, void>({
            query: () => ({
                url: `orders`,
                method: "GET",
            }),
            providesTags: [{ type: "REFETCH_ORDER_API" }],
        }),
        
      

        updateStatus: builder.mutation<UpdateStatusResponse, UpdateStatusPayload>({
            query: (payload) => ({
                url: `update-status`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: [{ type: "REFETCH_ORDER_API" }],
        }),

        updateStatusForCOD: builder.mutation<UpdateStatusForCODResponse, UpdateStatusForCODPayload>({
            query: (payload) => ({
                url: `update-status/cod`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: [{ type: "REFETCH_ORDER_API" }],
        }),
    }),
});

export const {
    useGetAllOrdersQuery,
    useUpdateStatusMutation,
    useUpdateStatusForCODMutation
} = orderApi;
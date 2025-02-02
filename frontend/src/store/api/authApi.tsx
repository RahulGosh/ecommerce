import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../slices/authSlice";
import {
  AddShippingDetailPayload,
  LoginResponse,
  OrderResponse,
  ProfileData,
  RegisterBody,
  ShippingDetailResponse,
  UpdateShippingDetailPayload,
} from "../../types/types";

const USER_API = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["Auth"],
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    register: builder.mutation<LoginResponse, RegisterBody>({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
      }),
    }),

    login: builder.mutation<LoginResponse, { email: string; password: string }>(
      {
        query: (inputData) => ({
          url: "login",
          method: "POST",
          body: inputData,
        }),
        async onQueryStarted(_, { queryFulfilled, dispatch }) {
          try {
            const result = await queryFulfilled;
            dispatch(userLoggedIn({ user: result.data.user }));
          } catch (error) {
            console.log(error);
          }
        },
      }
    ),

    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
        } catch (error) {
          console.log("Logout Error:", error);
        }
      },
    }),

    loadUser: builder.query<ProfileData, void>({
      query: () => ({
        url: "me",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data }));
          console.log(result, "result");
        } catch (error) {
          console.log(error);
        }
      },
    }),

    createShippingDetail: builder.mutation<
      ShippingDetailResponse,
      AddShippingDetailPayload
    >({
      query: (inputData) => ({
        url: "create-shipping-detail",
        method: "POST",
        body: inputData,
      }),
    }),

    updateShippingDetail: builder.mutation<
      ShippingDetailResponse,
      UpdateShippingDetailPayload
    >({
      query: (inputData) => ({
        url: "update-shipping-detail",
        method: "PUT",
        body: inputData,
      }),
      invalidatesTags: [{ type: "Auth" }],
    }),

    getShippingDetails: builder.query<ShippingDetailResponse, void>({
      query: () => ({
        url: "shipping-detail",
        method: "GET",
      }),
      providesTags: [{ type: "Auth" }],
    }),

    placeOrder: builder.mutation<OrderResponse, { shippingId: string; method: string }>({
      query: ({ shippingId, method }) => ({
        url: `place-order`, // endpoint for placing the order
        method: "POST",
        body: { shippingId, paymentMethod: method },
      }),
      invalidatesTags: [{ type: "Auth" }],
    }),

    placeOrderWithStripe: builder.mutation<{ success: boolean; url: string }, void>({
      query: () => ({
        url: "place-order/stripe",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Auth" }],
    }),

    getUserOrder: builder.query<OrderResponse, void>({
      query: () => ({
        url: `user-orders`, // endpoint for getting a single order by ID
        method: "GET",
      }),
      providesTags: [{ type: "Auth" }],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useLoadUserQuery,
  useCreateShippingDetailMutation,
  useUpdateShippingDetailMutation,
  useGetShippingDetailsQuery,
  usePlaceOrderMutation,
  useGetUserOrderQuery,
  usePlaceOrderWithStripeMutation
} = authApi;

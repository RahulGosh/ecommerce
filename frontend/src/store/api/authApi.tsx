import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../slices/authSlice";
import {
  AddToRecentlyViewedResponse,
  CreateShippingDetailRequest,
  LoginResponse,
  OrderResponse,
  ProfileData,
  RecentlyViewedResponse,
  RegisterBody,
  ShippingDetailResponse,
  UpdateShippingDetailPayload,
} from "../../types/types";

const USER_API = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["Auth", "RecentlyViewed"], // Added RecentlyViewed as a new tag
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

            // Refetch user details after login
            dispatch(authApi.endpoints.loadUser.initiate());
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

    getShippingDetails: builder.query<ShippingDetailResponse, void>({
      query: () => ({
        url: "shipping-detail",
        method: "GET",
      }),
      providesTags: [{ type: "Auth" }], // Ensure it provides a tag for refetching
    }),

    // ✅ Create Shipping Detail
    createShippingDetail: builder.mutation<
      ShippingDetailResponse,
      CreateShippingDetailRequest
    >({
      query: (data) => ({
        url: "create-shipping-detail",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Auth" }], // Ensure it refetches after creation
    }),

    // ✅ Update Shipping Detail
    updateShippingDetail: builder.mutation<
      ShippingDetailResponse,
      UpdateShippingDetailPayload
    >({
      query: (inputData) => ({
        url: "update-shipping-detail",
        method: "PUT",
        body: inputData,
      }),
      invalidatesTags: [{ type: "Auth" }], // Refetch after updating
    }),

    placeOrder: builder.mutation<
      OrderResponse,
      { shippingId: string; method: string }
    >({
      query: ({ shippingId, method }) => ({
        url: `place-order`, // endpoint for placing the order
        method: "POST",
        body: { shippingId, paymentMethod: method },
      }),
      invalidatesTags: [{ type: "Auth" }],
    }),

    placeOrderWithStripe: builder.mutation<
      { success: boolean; url: string },
      void
    >({
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

    forgotPassword: builder.mutation<
      { success: boolean; message: string },
      { email: string }
    >({
      query: ({ email }) => ({
        url: "forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation<
      { success: boolean; message: string },
      { token: string; password: string }
    >({
      query: ({ token, password }) => ({
        url: `reset-password/${token}`,
        method: "POST",
        body: { password: password },
      }),
    }),

    getRecentlyViewed: builder.query<RecentlyViewedResponse, void>({
      query: () => ({
        url: "recently-viewed",
        method: "GET",
      }),
      providesTags: ["RecentlyViewed"], // Tag for cache invalidation
    }),

    addToRecentlyViewed: builder.mutation<
      AddToRecentlyViewedResponse,
      { productId: string }
    >({
      query: ({ productId }) => ({
        url: `add-to-recently-viewed/${productId}`,
        method: "POST",
      }),
      invalidatesTags: ["RecentlyViewed"], // Invalidate cache after adding
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        // Changed parameter name
        try {
          const { data } = await queryFulfilled;
          if (data.user) {
            dispatch(userLoggedIn({ user: data.user }));
          }
        } catch (error) {
          console.log("Error adding to recently viewed:", error);
        }
      },
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
  usePlaceOrderWithStripeMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetRecentlyViewedQuery,
  useAddToRecentlyViewedMutation,
} = authApi;

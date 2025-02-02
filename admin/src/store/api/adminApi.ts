import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { adminLoggedIn, adminLoggedOut } from "../slices/adminSlice";
import { AdminLoginResponse, ProfileData } from "../../types/types";

const Admin_API = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

export const adminApi = createApi({
    reducerPath: "adminApi",
    tagTypes: ["REFETCH_ADMIN_PANEL"],
    baseQuery: fetchBaseQuery({
        baseUrl: Admin_API,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        login: builder.mutation<AdminLoginResponse, { email: string; password: string }>({
            query: (credentials) => ({
                url: "admin-login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: [{ type: "REFETCH_ADMIN_PANEL" }],
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(adminLoggedIn({ admin: result.data.admin }));
                } catch (error) {
                    console.log(error);
                }
            },
        }),
        logout: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: "logout",
                method: "GET",
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                    dispatch(adminLoggedOut());
                } catch (error) {
                    console.log("Logout Error:", error);
                }
            },
        }),

        loadAdmin: builder.query<ProfileData, void>({
            query: () => ({
                url: "getAdminDetail",
                method: "GET",
            }),
            providesTags: [{ type: "REFETCH_ADMIN_PANEL" }],
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(adminLoggedIn({ admin: result.data }));
                    console.log(result.data, "Loaded Admin Data"); // Debugging
                    console.log(result, "result")
                } catch (error) {
                    console.log(error);
                }
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useLoadAdminQuery
} = adminApi;

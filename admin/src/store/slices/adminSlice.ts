import { Admin } from "../../types/types";
import { createSlice } from "@reduxjs/toolkit";

interface AdminState {
  admin: Admin | null;
  isAuthenticated: boolean;
}

const initialState: AdminState = {
  admin: null,
  isAuthenticated: false,
}; 


const adminSlice = createSlice({
  name: "adminSlice",
  initialState,
  reducers: {
    adminLoggedIn: (state, action) => {
        state.admin = action.payload.admin;
        state.isAuthenticated = true;
    },
    adminLoggedOut:(state) => {
        state.admin = null;
        state.isAuthenticated = false;
    }
  },
});

export const {adminLoggedIn, adminLoggedOut} = adminSlice.actions;
export default adminSlice.reducer;
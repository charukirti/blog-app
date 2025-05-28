import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "../types";

const initialState: AuthState = {
  user: null,
  isAuhenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuhenticated = true;
      state.isLoading = false;
    },

    clearUser: (state) => {
      state.user = null;
      state.isAuhenticated = false;
      state.isLoading = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});


export const { setUser, clearUser, setLoading } = authSlice.actions
export default authSlice.reducer
import { AuthState, RootState } from "@/app/types";
import { createSlice } from "@reduxjs/toolkit";

/* Initial State */
const initialState: AuthState = {
  authInfo: null,
  isReady: false,
};

/* Slice */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthInfo: (state, action) => {
      state.authInfo = action.payload;
      state.isReady = true;
    },
    clearAuthInfo: (state) => {
      state.authInfo = null;
      state.isReady = true;
    },
  },
});

export const { setAuthInfo, clearAuthInfo } = authSlice.actions;
export default authSlice.reducer;

/* Selectors */
export const authInfoSelector = (state: RootState) => state?.auth?.authInfo;

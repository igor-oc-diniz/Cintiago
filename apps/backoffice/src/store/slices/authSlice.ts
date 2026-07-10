import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { MeDTO } from "@cintiago/shared";
import type { RootState } from "../store";

interface AuthState {
  token: string | null;
  user: MeDTO | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: MeDTO }>,
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoading = false;
    },
    // Used in the dev-token bootstrap (Phase 0): stores the token before we
    // have the user, so the axios interceptor already sends the Bearer
    // header on the following GET /auth/me call.
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isLoading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, setToken, logout, setLoading } =
  authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectToken = (state: RootState) => state.auth.token;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsLoggedIn = (state: RootState) => !!state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '@/types/domain'
import type { RootState } from '../store'

interface AuthState {
  token: string | null
  user: AuthUser | null
  isLoading: boolean
}

const initialState: AuthState = {
  token: null,
  user: null,
  isLoading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: AuthUser }>,
    ) {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isLoading = false
    },
    logout(state) {
      state.token = null
      state.user = null
      state.isLoading = false
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
  },
})

export const { setCredentials, logout, setLoading } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectToken = (state: RootState) => state.auth.token
export const selectUser = (state: RootState) => state.auth.user
export const selectIsLoggedIn = (state: RootState) => !!state.auth.token
export const selectHasCompletedProfile = (state: RootState) =>
  !!state.auth.user?.clientId
export const selectAuthLoading = (state: RootState) => state.auth.isLoading

import { useAppSelector, useAppDispatch } from '@/store/hooks'
import {
  selectUser,
  selectToken,
  selectIsLoggedIn,
  selectHasCompletedProfile,
  selectAuthLoading,
  logout,
} from '@/store/slices/authSlice'

export function useAuth() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const token = useAppSelector(selectToken)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const hasCompletedProfile = useAppSelector(selectHasCompletedProfile)
  const isLoading = useAppSelector(selectAuthLoading)

  return {
    user,
    token,
    isLoggedIn,
    hasCompletedProfile,
    isLoading,
    logout: () => dispatch(logout()),
  }
}

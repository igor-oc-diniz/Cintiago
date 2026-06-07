import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectUser,
  selectToken,
  selectIsLoggedIn,
  selectHasCompletedProfile,
  selectAuthLoading,
  logout,
} from "@/store/slices/authSlice";
import { logoutApi } from "@/api/auth";

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const hasCompletedProfile = useAppSelector(selectHasCompletedProfile);
  const isLoading = useAppSelector(selectAuthLoading);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } finally {
      dispatch(logout());
    }
  };

  return {
    user,
    token,
    isLoggedIn,
    hasCompletedProfile,
    isLoading,
    logout: handleLogout,
  };
}

import { useAppSelector } from "@/store/hooks";
import {
  selectUser,
  selectToken,
  selectIsLoggedIn,
  selectAuthLoading,
} from "@/store/slices/authSlice";

export function useAuth() {
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isLoading = useAppSelector(selectAuthLoading);

  return { user, token, isLoggedIn, isLoading };
}

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Hooks tipados — use sempre estes no lugar de useDispatch/useSelector puros
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);

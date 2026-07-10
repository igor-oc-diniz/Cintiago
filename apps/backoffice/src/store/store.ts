import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

// No redux-persist: nothing here needs to survive a reload yet (the session
// is always re-derived from the API/cookie via useInitAuth). Revisit once the
// first slice that needs persistence shows up (e.g. UI preferences).
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

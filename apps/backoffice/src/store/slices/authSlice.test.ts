import { describe, it, expect } from "vitest";
import type { MeDTO } from "@cintiago/shared";
import reducer, { setCredentials, setLoading, logout } from "./authSlice";

const user: MeDTO = {
  id: 1,
  name: "Maria",
  email: "maria@example.com",
  avatar: null,
  role: "OPERATOR",
  clientId: null,
};

describe("authSlice", () => {
  it("starts loading: guards must wait for the session bootstrap", () => {
    const state = reducer(undefined, { type: "@@INIT" });
    expect(state).toEqual({ token: null, user: null, isLoading: true });
  });

  it("setCredentials stores the session and settles loading", () => {
    const state = reducer(undefined, setCredentials({ token: "cookie", user }));
    expect(state.user).toEqual(user);
    expect(state.token).toBe("cookie");
    expect(state.isLoading).toBe(false);
  });

  it("setLoading(false) settles as guest when the bootstrap fails", () => {
    const state = reducer(undefined, setLoading(false));
    expect(state).toEqual({ token: null, user: null, isLoading: false });
  });

  it("logout clears the session without re-entering the loading state", () => {
    const loggedIn = reducer(
      undefined,
      setCredentials({ token: "cookie", user }),
    );
    const state = reducer(loggedIn, logout());
    expect(state).toEqual({ token: null, user: null, isLoading: false });
  });
});

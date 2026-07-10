import { describe, it, expect } from "vitest";
import { api } from "./client";

describe("api client", () => {
  it("usa VITE_API_URL como baseURL", () => {
    expect(api.defaults.baseURL).toBe(import.meta.env.VITE_API_URL);
  });

  it("manda credentials (cookie httpOnly) em toda request", () => {
    expect(api.defaults.withCredentials).toBe(true);
  });
});

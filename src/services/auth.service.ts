import { api } from "./api";
import type { LoginPayload, SignupPayload, AuthResponse } from "../types/auth";

export const authService = {
  login: (data: LoginPayload) =>
    api.post<AuthResponse>("/auth/web/login", data).then((r) => r.data),

  signup: (data: SignupPayload) =>
    api.post<AuthResponse>("/auth/web/signup", data).then((r) => r.data),

  async refresh() {
    const refreshToken = localStorage.getItem("refreshToken");
    const { data } = await api.post<AuthResponse>("/auth/web/refresh", { refreshToken });
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  },
};

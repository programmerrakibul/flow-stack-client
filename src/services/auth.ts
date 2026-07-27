import type { TSignInPayload, TSignUpPayload } from "@/types/api-types";
import api from "@/lib/axios";
import type { TResponse } from "@/types/api";
import type { TUser } from "@/types/user";

export const authService = {
  signUp: async (payload: TSignUpPayload) => {
    const { data } = await api.post<TResponse<TUser>>("/auth/sign-up", payload);
    return data;
  },

  signIn: async (payload: TSignInPayload) => {
    const { data } = await api.post<TResponse<TUser>>("/auth/sign-in", payload);
    return data;
  },

  signOut: async () => {
    const { data } = await api.post<TResponse>("/auth/sign-out");
    return data;
  },

  refreshToken: async () => {
    const { data } = await api.post<TResponse>("/auth/refresh-token");
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get<TResponse>("/auth/profile");
    return data;
  },
};

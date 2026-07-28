import api from "@/lib/axios";
import type { TResponse } from "@/types/api";
import type { TUser } from "@/types/user";
import type { SignInFormData, SignUpFormData } from "@/validation/auth.schema";

export const authService = {
  signUp: async (payload: Omit<SignUpFormData, "confirmPassword">) => {
    const { data } = await api.post<TResponse<TUser>>("/auth/sign-up", payload);
    return data;
  },

  signIn: async (payload: SignInFormData) => {
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
    const { data } = await api.get<TResponse<TUser>>("/auth/profile");
    return data;
  },
};

import { authService } from "@/services/auth";
import type { TUser } from "@/types/user";
import localStorageUtils from "@/utils/local-storage";
import type { SignInFormData, SignUpFormData } from "@/validation/auth.schema";
import { create } from "zustand";

type AuthState =
  | {
      user: TUser;
      isLoading: boolean;
      isAuthenticated: true;
      authLoading: false;
    }
  | {
      isLoading: boolean;
      authLoading: true;
      isAuthenticated: false;
    };

export const useAuthStore = create<AuthState>(() => ({
  isLoading: false,
  isAuthenticated: false,
  authLoading: true,
}));

export const setAuthLoading = (isLoading: boolean) => {
  useAuthStore.setState({ isLoading });
};

export const setUser = (data?: { user: TUser; token: string | undefined }) => {
  if (!data) {
    useAuthStore.setState({ isAuthenticated: false });
    return;
  }

  useAuthStore.setState({ user: data.user, isAuthenticated: true });

  if (!data.token) return;

  localStorageUtils.setAuthToken(data.token);
};

export const signIn = async (payload: SignInFormData) => {
  setAuthLoading(true);

  try {
    const data = await authService.signIn(payload);

    if (!data.success) {
      localStorageUtils.removeAuthToken();
      setUser();

      throw Error(data.message);
    }

    setUser({
      user: data.data as TUser,
      token: data.token,
    });
  } catch (error: unknown) {
    localStorageUtils.removeAuthToken();
    setUser();

    throw error;
  } finally {
    setAuthLoading(false);
  }
};

export const signUp = async (
  payload: Omit<SignUpFormData, "confirmPassword">,
) => {
  setAuthLoading(true);

  try {
    const data = await authService.signUp(payload);

    if (!data.success) {
      localStorageUtils.removeAuthToken();
      setUser();

      throw Error(data.message);
    }

    setUser({
      user: data.data as TUser,
      token: data.token,
    });
  } catch (error: unknown) {
    localStorageUtils.removeAuthToken();
    setUser();

    throw error;
  } finally {
    setAuthLoading(false);
  }
};

export const signOut = async () => {
  setAuthLoading(true);

  await authService.signOut();

  localStorageUtils.removeAuthToken();
  useAuthStore.setState({
    isAuthenticated: false,
    isLoading: false,
  });
};

export const fetchProfile = async () => {
  setAuthLoading(true);
  useAuthStore.setState({ authLoading: true });

  try {
    const token = localStorageUtils.getAuthToken();

    if (!token) {
      setUser();
      return;
    }

    const data = await authService.getProfile();
    if (data.success) {
      setUser({
        user: data.data as TUser,
        token,
      });

      return;
    }

    localStorageUtils.removeAuthToken();
    setUser();
  } catch {
    setUser();
    localStorageUtils.removeAuthToken();
  } finally {
    setAuthLoading(false);
    useAuthStore.setState({ authLoading: false });
  }
};

const authStore = {
  useAuthStore,
  signIn,
  signUp,
  signOut,
  setUser,
};

export default authStore;

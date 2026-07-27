import api from "@/lib/axios";
import { useAuthStore } from "@/stores/auth-store";
import localStorageUtils from "./local-storage";

export const fetchProfile = async () => {
  const { setUser, setIsLoading } = useAuthStore.getState();
  setIsLoading(true);
  try {
    const { data } = await api.get("/auth/profile");
    if (data.success) {
      localStorageUtils.setItem(localStorageUtils.AUTH_TOKEN_KEY, data.token);
      setUser(data.data);
    } else {
      setUser(null);
    }
  } catch {
    setUser(null);
    localStorageUtils.removeItem(localStorageUtils.AUTH_TOKEN_KEY);
  } finally {
    setIsLoading(false);
  }
};

export const signOut = async () => {
  const { setUser } = useAuthStore.getState();
  try {
    await api.post("/auth/sign-out");
    localStorageUtils.removeItem(localStorageUtils.AUTH_TOKEN_KEY);
  } finally {
    setUser(null);
    window.location.href = "/sign-in";
  }
};

const AUTH_TOKEN_KEY = "__fs_token__";

const setItem = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return;

  try {
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`[localStorage] Error saving key "${key}":`, error);
  }
};

const getItem = <T>(key: string, defaultValue: T | null = null): T | null => {
  if (typeof window === "undefined") return defaultValue;

  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;

    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  } catch (error) {
    console.error(`[localStorage] Error reading key "${key}":`, error);
    return defaultValue;
  }
};

const removeItem = (key: string): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[localStorage] Error removing key "${key}":`, error);
  }
};

const setAuthToken = (token: string) => setItem(AUTH_TOKEN_KEY, token);

const removeAuthToken = () => removeItem(AUTH_TOKEN_KEY);

const localStorageUtils = {
  setItem,
  getItem,
  removeItem,
  AUTH_TOKEN_KEY,
  setAuthToken,
  removeAuthToken,
};

export default localStorageUtils;

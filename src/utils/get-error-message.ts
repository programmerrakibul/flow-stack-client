import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown): string | null => {
  if (error instanceof Error) {
    return error.message;
  }

  if (error instanceof AxiosError) {
    return error.response?.data?.message as string;
  }

  return null;
};

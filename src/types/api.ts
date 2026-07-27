export interface TPagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface TSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
  pagination?: TPagination;
  token?: string;
}

export interface TErrorResponse {
  success: false;
  message: string;
}

export type TResponse<T = unknown> = TSuccessResponse<T> | TErrorResponse;

// # 공통 API 응답 타입
export type ApiResponse<T = null> = {
  success: boolean;
  code: string;
  message: string;
  data: T | null;
};

// # 공통 API 에러 응답 타입
export type ApiErrorResponse = ApiResponse<null>;
// # 공통 API 응답 타입
export type ApiResponse<T = null> = {
  success: boolean;
  code: string;
  message: string;
  data: T | null;
};

// # 공통 API 에러 응답 타입
export type ApiErrorResponse = ApiResponse<null>;

// # 사용자 권한 타입
// GUEST: 비회원, USER: 정식 회원, NONE: 사용자 상태 조회(GET /users/status) 응답과 맞추기 위한 값
export type UserRole = 'GUEST' | 'USER' | 'NONE';

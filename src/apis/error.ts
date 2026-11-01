import axios from 'axios';
import type { ApiErrorResponse } from './types';

// # 타입 영역
export type ApiErrorKind = 'http' | 'network' | 'timeout' | 'unknown';

// # 공통 API 에러 클래스
export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly code?: string;

  constructor(
    message: string,
    kind: ApiErrorKind,
    status?: number,
    code?: string,
  ) {
    super(message);

    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
    this.code = code;
  }
}

// # 타입 가드
const isApiErrorResponse = (data: unknown): data is ApiErrorResponse => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const response = data as Record<string, unknown>;

  return (
    response.success === false &&
    typeof response.code === 'string' &&
    typeof response.message === 'string' &&
    response.data === null
  );
};

// # 에러 변환 함수
export const normalizeApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (!axios.isAxiosError(error)) {
    return new ApiError(
      '알 수 없는 오류가 발생했습니다.',
      'unknown',
    );
  }

  // HTTP 응답이 있는 경우
  if (error.response) {
    const { status, data } = error.response;

    if (isApiErrorResponse(data)) {
      return new ApiError(data.message, 'http', status, data.code);
    }

    return new ApiError(
      '서버 요청 처리 중 오류가 발생했습니다.',
      'http',
      status,
    );
  }

  // 타임아웃
  if (
    error.code === 'ECONNABORTED' ||
    error.code === 'ETIMEDOUT'
  ) {
    return new ApiError(
      '요청 시간이 초과되었습니다.',
      'timeout',
    );
  }

  // 네트워크 오류
  if (error.code === 'ERR_NETWORK' || error.request) {
    return new ApiError(
      '네트워크 연결을 확인해 주세요.',
      'network',
    );
  }

  return new ApiError(
    '알 수 없는 오류가 발생했습니다.',
    'unknown',
  );
};
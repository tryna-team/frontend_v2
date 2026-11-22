import axios from 'axios';

import { getAuthState } from '@/stores/authStore';
import { normalizeApiError } from './error';

// # 상수 영역
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const TIMEOUT = 10000;

if (!BASE_URL) {
  throw new Error('EXPO_PUBLIC_API_BASE_URL 환경변수가 설정되지 않았습니다.');
}

// TODO: 정식 인증 API 연동 이후 임시 Access Token 설정 제거
if (__DEV__) {
  const testAccessToken = process.env.EXPO_PUBLIC_TEST_ACCESS_TOKEN;

  if (testAccessToken) {
    getAuthState().setAccessToken(testAccessToken);
  }
}

// # Axios 인스턴스
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    Accept: 'application/json',
  },
});

// # 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = getAuthState();

    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return config;
  },
  (error) => Promise.reject(normalizeApiError(error)),
);

// # 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error)),
);

export default apiClient;
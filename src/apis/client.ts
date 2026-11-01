import axios from 'axios';

// # 상수 영역
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const TIMEOUT = 10000;

if (!BASE_URL) {
  throw new Error('EXPO_PUBLIC_API_BASE_URL 환경변수가 설정되지 않았습니다.');
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
    return config;
  },
  (error) => Promise.reject(error),
);

// # 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default apiClient;

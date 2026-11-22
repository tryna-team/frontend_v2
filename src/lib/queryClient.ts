import { QueryClient } from '@tanstack/react-query';

// # 상수 영역
const STALE_TIME = 1000 * 60;
const GC_TIME = 1000 * 60 * 5;

// # QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

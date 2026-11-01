import { create } from 'zustand';

import type { UserRole } from '@/apis/types/auth';
import { SECURE_KEYS, secureStorage } from '@/lib/storage';

// SecureStore 쓰기·삭제는 기다리지 않으므로, 앞 작업이 끝난 뒤에 실행되도록 이어 붙여 순서를 보장한다.
// 순서가 뒤집혀 옛 토큰이 남으면 다음 실행 때 재발급이 실패한다.
// secureStorage는 실패해도 reject하지 않으므로 체인이 중간에 끊기지 않는다.
let pendingWrite: Promise<unknown> = Promise.resolve();
let writeCount = 0;

function persistRefreshToken(refreshToken: string | null) {
  writeCount += 1;
  pendingWrite = pendingWrite.then(() =>
    refreshToken
      ? secureStorage.set(SECURE_KEYS.refreshToken, refreshToken)
      : secureStorage.remove(SECURE_KEYS.refreshToken),
  );
}

interface AuthState {
  /** 메모리에만 보관한다 */
  accessToken: string | null;
  /** SecureStore와 동기화된다. 앱 시작 시 restoreRefreshToken()으로 채운다 */
  refreshToken: string | null;
  userId: number | null;
  /** A101/A105/A106 응답의 userRole */
  userRole: UserRole | null;
  /** refreshToken이 있으면 true */
  isAuthenticated: boolean;

  /** SecureStore에 남은 refreshToken을 읽어 채운다. 앱 시작 흐름에서 API 호출 전에 호출한다 */
  restoreRefreshToken: () => Promise<void>;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  /** 재발급(A108) 응답이 accessToken만 내려주는 경우 대비용 */
  setAccessToken: (accessToken: string) => void;
  setUser: (userId: number, userRole?: UserRole) => void;
  /** A101은 userRole만 주고 userId는 주지 않으므로, 앱 진입 시 권한만 갱신할 때 사용한다 */
  setUserRole: (userRole: UserRole) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  // SecureStore는 비동기라 store를 만들 때 읽을 수 없다. restoreRefreshToken()에서 채운다
  accessToken: null,
  refreshToken: null,
  userId: null,
  userRole: null,
  isAuthenticated: false,

  restoreRefreshToken: async () => {
    const startedAt = writeCount;
    const refreshToken = await secureStorage.get(SECURE_KEYS.refreshToken);

    // 읽는 동안 토큰이 저장·삭제됐다면 메모리 값이 최신이므로 읽은 값은 버린다
    if (!refreshToken || writeCount !== startedAt) {
      return;
    }

    set({ refreshToken, isAuthenticated: true });
  },

  // 인터셉터가 새 토큰을 바로 읽도록 메모리를 먼저 바꾸고, SecureStore 기록은 기다리지 않는다
  setTokens: ({ accessToken, refreshToken }) => {
    set({ accessToken, refreshToken, isAuthenticated: true });
    persistRefreshToken(refreshToken);
  },

  setAccessToken: (accessToken) => set({ accessToken }),

  setUser: (userId, userRole) => set({ userId, userRole: userRole ?? null }),

  setUserRole: (userRole) => set({ userRole }),

  clearAuth: () => {
    set({
      accessToken: null,
      refreshToken: null,
      userId: null,
      userRole: null,
      isAuthenticated: false,
    });
    // 추가 예정: SecureStore 삭제가 실패하면 다음 실행에 옛 토큰이 복원될 수 있다.
    // 서버 로그아웃(A109)으로 세션이 무효화되면 재발급이 거절돼 비회원으로 넘어가지만,
    // 로그아웃 흐름을 옮길 때 삭제 실패를 기록해 다음 실행에서 토큰 복원 전에 다시 지우도록 처리한다
    persistRefreshToken(null);
  },
}));

/** 컴포넌트 밖(axios 인터셉터 등)에서 최신 상태를 읽을 때 사용한다 */
export const getAuthState = () => useAuthStore.getState();

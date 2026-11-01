import { useEffect, useState } from 'react';

import { clearSecureStorageOnFirstLaunch } from '@/lib/storage';
import { useAuthStore } from '@/stores';

// 앱을 켤 때 한 번만 실행한다. Fast Refresh 등으로 effect가 다시 실행돼도 같은 Promise를 쓴다.
let preparing: Promise<void> | null = null;

async function prepareApp(): Promise<void> {
  // 재설치 후 남은 옛 토큰을 지운 다음에 읽어야 한다
  await clearSecureStorageOnFirstLaunch();
  await useAuthStore.getState().restoreRefreshToken();
  // 추가 예정: 재발급(A108) → 상태 확인(A101) → 비회원 시작(A102)은 API 계층 이식 후 여기에 연결
}

/**
 * 앱 시작 준비가 끝났는지 반환한다. 루트 레이아웃은 준비가 끝난 뒤에 화면을 그린다.
 * 화면이 먼저 마운트되면 토큰을 복원하기 전에 API 요청이 나갈 수 있기 때문이다.
 */
export function useAppReady(): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 준비에 실패해도 앱은 연다. 토큰 없는 상태(새 비회원)로 진행되고, 스플래시가 계속 남지 않는다
    preparing ??= prepareApp().catch((error: unknown) => {
      if (__DEV__) {
        console.warn('[useAppReady] 앱 시작 준비 실패', error);
      }
    });
    preparing.then(() => setIsReady(true));
  }, []);

  return isReady;
}

import { useEffect, useState } from 'react';

import { clearSecureStorageOnFirstLaunch } from '@/lib/storage';
import { useAuthStore, useSettingsStore } from '@/stores';

// 앱을 켤 때 한 번만 실행한다. Fast Refresh 등으로 effect가 다시 실행돼도 같은 Promise를 쓴다.
let preparing: Promise<void> | null = null;

// 재설치 후 남은 옛 토큰을 지운 다음에 읽어야 한다. 지우지 못했으면 이번 실행에서는 토큰 없이 시작한다
async function restoreSession(): Promise<void> {
  const canRestore = await clearSecureStorageOnFirstLaunch();

  if (canRestore) {
    await useAuthStore.getState().restoreRefreshToken();
  }
}

async function prepareApp(): Promise<void> {
  // 설정 복원과 토큰 복원은 서로 관계가 없어 동시에 실행한다
  await Promise.all([useSettingsStore.persist.rehydrate(), restoreSession()]);
  // 추가 예정: 재발급(A108) → 상태 확인(A101) → 비회원 시작(A102)은 API 계층 이식 후 여기에 연결
}

/**
 * 앱 시작 준비가 끝났는지 반환한다. 루트 레이아웃은 준비가 끝난 뒤에 화면을 그린다.
 * 화면이 먼저 마운트되면 복원 전 기본 설정이 잠깐 보이거나, 토큰을 복원하기 전에 API 요청이 나갈 수 있기 때문이다.
 * 웹 정적 HTML은 준비 전 상태로 만들어져 화면 내용이 없고, 화면은 JS가 실행된 뒤에 나타난다.
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

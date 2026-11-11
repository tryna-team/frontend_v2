import { STORAGE_KEYS, storage } from '@/lib/storage';

/**
 * 비회원 → 회원 전환 유도 시트의 노출 이력.
 *
 * 일정을 만들 때마다 뜨면 이탈 요인이 되므로 기기당 1회만 노출한다.
 * 로그아웃하면 다시 비회원이 되고 회원 탈퇴하면 새 비회원으로 시작하므로, 두 경우 모두 이력을 지워 다시 안내한다.
 */

// 확인 예정: 유도 시트를 띄우는 방식은 로그인 시트 구현 방식이 정해질 때 함께 정한다

/** 읽기에 실패하면 노출한 적이 없는 것으로 본다 */
export async function hasShownConversionPrompt(): Promise<boolean> {
  return Boolean(await storage.get(STORAGE_KEYS.conversionPromptShown));
}

export async function markConversionPromptShown(): Promise<void> {
  await storage.set(STORAGE_KEYS.conversionPromptShown, 'true');
}

export async function clearConversionPromptHistory(): Promise<void> {
  await storage.remove(STORAGE_KEYS.conversionPromptShown);
}

import { KV_KEYS, kvStorage } from '@/lib/storage';

/**
 * 비회원 → 회원 전환 유도 시트의 노출 이력.
 *
 * 일정을 만들 때마다 뜨면 이탈 요인이 되므로 기기당 1회만 노출한다.
 * 로그아웃하면 다시 비회원이 되고 회원 탈퇴하면 새 비회원으로 시작하므로, 두 경우 모두 이력을 지워 다시 안내한다.
 */

export function hasShownConversionPrompt(): boolean {
  return Boolean(kvStorage.get(KV_KEYS.conversionPromptShown));
}

export function markConversionPromptShown(): void {
  kvStorage.set(KV_KEYS.conversionPromptShown, 'true');
}

export function clearConversionPromptHistory(): void {
  kvStorage.remove(KV_KEYS.conversionPromptShown);
}

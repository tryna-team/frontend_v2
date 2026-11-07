import { KV_KEYS, kvStorage } from '@/lib/storage';

/**
 * 이 기기에서 정식 회원으로 로그인한 적이 있는지에 대한 이력.
 *
 * A106 회원 전환은 이미 가입된 소셜 계정이면 AUTH_409로 막힌다. 그 시점엔 백엔드가 인가 코드를
 * 이미 소진한 뒤라, 로그인하려면 새 코드를 받으러 구글 로그인을 한 번 더 거쳐야 한다.
 * 로그인 전에는 그 계정이 가입돼 있는지 알 수 없으므로, 이 기기에서 회원 로그인을 한 적이 있으면
 * 전환을 시도하지 않고 A105로 바로 보낸다.
 *
 * 회원 탈퇴하면 계정이 사라져 다시 전환할 수 있으므로 이 이력도 함께 지운다.
 */

// 확인 예정: 네이티브 구글 로그인 방식이 정해지면 이 이력이 여전히 필요한지 확인

export function hasMemberLoggedInOnDevice(): boolean {
  return Boolean(kvStorage.get(KV_KEYS.memberLoggedIn));
}

export function markMemberLoggedInOnDevice(): void {
  kvStorage.set(KV_KEYS.memberLoggedIn, 'true');
}

export function clearMemberLoginHistory(): void {
  kvStorage.remove(KV_KEYS.memberLoggedIn);
}

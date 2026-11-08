import { SECURE_KEYS, STORAGE_KEYS } from './keys';
import { secureStorage } from './secureStorage';
import { storage } from './storage';

/**
 * iOS는 앱을 지웠다 다시 설치해도 SecureStore(Keychain) 값이 남을 수 있다.
 * 일반 저장소는 앱을 지우면 함께 지워지므로, 플래그가 없으면 첫 설치나 재설치로 보고 남은 토큰을 지운다.
 * 앱 시작 시 refreshToken을 읽기 전에 호출한다.
 *
 * @returns SecureStore 값을 읽어도 되면 true. false면 이번 실행에서는 토큰을 복원하지 않는다
 */
export async function clearSecureStorageOnFirstLaunch(): Promise<boolean> {
  const launched = await storage.read(STORAGE_KEYS.hasLaunched);

  // 읽기 실패를 플래그 없음으로 보고 지우면 로그인이 풀린다. 지우지 않고 이번 실행만 복원을 건너뛴다
  if (!launched.ok) {
    return false;
  }

  if (launched.value) {
    return true;
  }

  const results = await Promise.all(
    Object.values(SECURE_KEYS).map((key) => secureStorage.remove(key)),
  );

  // 하나라도 실패하면 플래그를 남기지 않아 다음 실행에서 다시 지운다.
  // 삭제가 끝난 뒤에 플래그를 남겨야, 중간에 앱이 종료돼도 옛 토큰이 남지 않는다.
  if (!results.every(Boolean)) {
    return false;
  }

  // 플래그 기록에 실패해도 이미 비운 상태라 이번 실행은 복원해도 된다. 다음 실행에서 다시 정리한다
  await storage.set(STORAGE_KEYS.hasLaunched, 'true');
  return true;
}

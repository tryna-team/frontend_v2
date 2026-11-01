import { KV_KEYS, SECURE_KEYS } from './keys';
import { kvStorage } from './kvStorage';
import { secureStorage } from './secureStorage';

/**
 * iOS는 앱을 지웠다 다시 설치해도 SecureStore(Keychain) 값이 남을 수 있다.
 * kv-store는 재설치하면 지워지므로, 플래그가 없으면 첫 설치나 재설치로 보고 남은 토큰을 지운다.
 * 앱 시작 시 refreshToken을 읽기 전에 호출한다.
 *
 * @returns SecureStore 값을 읽어도 되면 true. 삭제에 실패했으면 false이므로 이번 실행에서는 토큰을 복원하지 않는다
 */
export async function clearSecureStorageOnFirstLaunch(): Promise<boolean> {
  if (kvStorage.get(KV_KEYS.hasLaunched)) {
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

  kvStorage.set(KV_KEYS.hasLaunched, 'true');
  return true;
}

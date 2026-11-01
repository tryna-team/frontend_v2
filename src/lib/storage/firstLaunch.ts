import { KV_KEYS, SECURE_KEYS } from './keys';
import { kvStorage } from './kvStorage';
import { secureStorage } from './secureStorage';

/**
 * iOS는 앱을 지웠다 다시 설치해도 SecureStore(Keychain) 값이 남을 수 있다.
 * kv-store는 재설치하면 지워지므로, 플래그가 없으면 첫 설치나 재설치로 보고 남은 토큰을 지운다.
 * 앱 시작 시 refreshToken을 읽기 전에 호출한다.
 */
export async function clearSecureStorageOnFirstLaunch(): Promise<void> {
  if (kvStorage.get(KV_KEYS.hasLaunched)) {
    return;
  }

  await Promise.all(Object.values(SECURE_KEYS).map((key) => secureStorage.remove(key)));
  // 삭제가 끝난 뒤에 플래그를 남긴다. 순서가 반대면 중간에 앱이 종료됐을 때 옛 토큰이 계속 남는다.
  kvStorage.set(KV_KEYS.hasLaunched, 'true');
}

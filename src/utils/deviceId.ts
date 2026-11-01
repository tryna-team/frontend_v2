import { randomUUID } from 'expo-crypto';

import { KV_KEYS, kvStorage } from '@/lib/storage';

// 저장소 읽기·쓰기가 실패해도 앱이 켜져 있는 동안은 같은 값을 쓰도록 메모리에도 둔다.
let cachedDeviceId: string | null = null;

/**
 * 이 설치본을 구분하는 deviceId. 저장된 값이 없으면 새로 만들어 저장한다.
 * 로그인·재발급·로그아웃 요청에 그대로 실리므로 앱이 켜져 있는 동안 바뀌면 안 된다.
 * 앱을 지우면 kv-store도 지워지므로 재설치하면 새 deviceId(새 비회원)로 시작한다.
 */
export function getDeviceId(): string {
  if (cachedDeviceId) {
    return cachedDeviceId;
  }

  let deviceId = kvStorage.get(KV_KEYS.deviceId);

  if (!deviceId) {
    deviceId = randomUUID();
    kvStorage.set(KV_KEYS.deviceId, deviceId);
  }

  cachedDeviceId = deviceId;
  return deviceId;
}

/**
 * 회원 탈퇴 후에만 호출한다. 로그아웃에서는 호출하지 않는다.
 * deviceId는 A102의 guestId라서, 그대로 두면 탈퇴 직후 비회원으로 다시 시작할 때
 * 삭제된 계정에 연결될 수 있다.
 */
export function resetDeviceId(): string {
  const deviceId = randomUUID();

  kvStorage.set(KV_KEYS.deviceId, deviceId);
  cachedDeviceId = deviceId;
  return deviceId;
}

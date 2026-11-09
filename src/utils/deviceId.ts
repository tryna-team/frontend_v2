import { randomUUID } from 'expo-crypto';

import { STORAGE_KEYS, storage } from '@/lib/storage';

// 저장소 읽기·쓰기가 실패해도 앱이 켜져 있는 동안은 같은 값을 쓰도록 메모리에도 둔다.
let cachedDeviceId: string | null = null;
// 메모리의 ID를 아직 저장하지 못했으면 true. 다음 호출 때 다시 저장한다.
let isPersistPending = false;
// 첫 읽기가 끝나기 전에 들어온 호출은 같은 결과를 기다린다. 각자 읽으면 ID가 두 개 만들어질 수 있다.
let loadingDeviceId: Promise<string> | null = null;

/** ID를 저장한다. 실패하면 다음 호출 때 다시 시도하도록 표시한다 */
async function persist(deviceId: string): Promise<boolean> {
  const saved = await storage.set(STORAGE_KEYS.deviceId, deviceId);
  isPersistPending = !saved;
  return saved;
}

async function loadDeviceId(): Promise<string> {
  const stored = await storage.read(STORAGE_KEYS.deviceId);

  // 읽기 실패를 값 없음으로 보고 새 ID를 저장하면 기존 ID(비회원 계정)를 잃는다.
  // 이번 실행에서만 쓸 임시 ID를 쓰고, 저장된 ID는 건드리지 않아 다음 실행에서 다시 읽게 한다.
  // 확인 예정: 임시 ID로 보낸 요청을 어떻게 다룰지는 API를 옮길 때 정한다
  if (!stored.ok) {
    return randomUUID();
  }

  if (stored.value) {
    return stored.value;
  }

  // 저장에 실패해도 이번 실행에서는 같은 ID를 쓰고, 다음 호출 때 다시 저장한다.
  // 끝내 저장하지 못한 채 앱이 종료되면 다음 실행에서 새 ID가 만들어진다.
  const deviceId = randomUUID();
  await persist(deviceId);
  return deviceId;
}

/**
 * 이 설치본을 구분하는 deviceId. 저장된 값이 없으면 새로 만들어 저장한다.
 * 비회원 시작(A102)의 guestId이고 로그인·재발급·로그아웃 요청에도 실리므로 앱이 켜져 있는 동안 바뀌면 안 된다.
 * 앱을 지우면 일반 저장소도 지워지므로 재설치하면 새 deviceId(새 비회원)로 시작한다.
 * 웹은 localStorage에 남아 새로고침해도 같은 비회원으로 이어진다. 웹의 randomUUID는 localhost·https에서만 동작한다.
 */
export async function getDeviceId(): Promise<string> {
  if (cachedDeviceId) {
    if (isPersistPending) {
      await persist(cachedDeviceId);
    }
    return cachedDeviceId;
  }

  loadingDeviceId ??= loadDeviceId().finally(() => {
    loadingDeviceId = null;
  });
  const deviceId = await loadingDeviceId;

  // 읽는 동안 resetDeviceId()가 새 ID를 정했다면 그 값을 쓴다
  cachedDeviceId ??= deviceId;
  return cachedDeviceId;
}

/**
 * 회원 탈퇴 후에만 호출한다. 로그아웃에서는 호출하지 않는다.
 * deviceId는 A102의 guestId라서, 그대로 두면 탈퇴 직후 비회원으로 다시 시작할 때
 * 삭제된 계정에 연결될 수 있다.
 *
 * 이번 실행에서는 저장 결과와 관계없이 새 ID를 쓴다.
 * 저장에 실패하면 다음 실행에서 옛 ID가 다시 쓰이므로 예외를 던져 호출부가 알 수 있게 한다.
 */
// 추가 예정: 저장 실패 시 처리(재시도, 사용자 안내)는 회원 탈퇴 API를 옮길 때 정한다
export async function resetDeviceId(): Promise<string> {
  const deviceId = randomUUID();

  cachedDeviceId = deviceId;

  // 실패해도 getDeviceId()가 호출될 때 다시 저장을 시도한다
  if (!(await persist(deviceId))) {
    throw new Error('deviceId 저장 실패');
  }

  return deviceId;
}

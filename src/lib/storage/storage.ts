import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

import type { StorageKey } from './keys';

// 일반 저장소. 암호화가 필요 없는 값(deviceId, 이력 플래그, 설정)을 AsyncStorage에 저장한다.
// iOS·Android는 기기 저장소, 웹은 localStorage에 저장되고, 모든 함수가 Promise를 돌려준다.
// 예외는 이 계층에서 끝낸다: 읽기 실패는 값 없음(null), 쓰기·삭제는 성공 여부(boolean)를 돌려주고 개발 모드 경고.
// 모듈 최상단이나 렌더링 중에는 호출하지 않는다. 웹 정적 빌드는 localStorage가 없는 Node에서 모듈을 실행한다.

/** 값 없음(value: null)과 읽기 실패(ok: false)를 구분해야 할 때 쓴다 */
export type StorageReadResult = { ok: true; value: string | null } | { ok: false };

function warn(action: string, key: string, error: unknown) {
  if (__DEV__) {
    console.warn(`[storage] ${action} ${key} 실패`, error);
  }
}

// persist(StateStorage)는 키를 string으로 받으므로 내부 함수는 string을 받고, 바깥에는 StorageKey로만 연다.
async function readItem(key: string): Promise<StorageReadResult> {
  try {
    return { ok: true, value: await AsyncStorage.getItem(key) };
  } catch (error) {
    warn('get', key, error);
    return { ok: false };
  }
}

async function getItem(key: string): Promise<string | null> {
  const result = await readItem(key);
  return result.ok ? result.value : null;
}

async function setItem(key: string, value: string): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    warn('set', key, error);
    return false;
  }
}

async function removeItem(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    warn('remove', key, error);
    return false;
  }
}

export const storage = {
  /** 읽기에 실패하면 null. 실패와 값 없음을 구분해야 하면 read()를 쓴다 */
  get: (key: StorageKey) => getItem(key),
  read: (key: StorageKey) => readItem(key),
  /** 성공하면 true */
  set: (key: StorageKey, value: string) => setItem(key, value),
  /** 성공하면 true */
  remove: (key: StorageKey) => removeItem(key),
};

// zustand persist용 어댑터. persist는 저장 실패를 처리하지 않으므로 오류 처리가 들어간 함수를 넘긴다.
// 비동기라 store를 만들 때 복원되지 않으므로, persist store는 skipHydration을 켜고 앱 시작 준비에서 복원한다.
export const persistStorage: StateStorage = {
  getItem,
  setItem,
  removeItem,
};

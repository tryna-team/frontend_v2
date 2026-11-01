import Storage from 'expo-sqlite/kv-store';
import type { StateStorage } from 'zustand/middleware';

import type { KvKey } from './keys';

// 동기 API를 쓴다. 오류 처리 규칙은 secureStorage와 같다.

// 확인 예정: 웹은 지원 대상이 아니다. 웹 지원이 정해지면 Expo SQLite 웹 설정(Metro wasm, COOP/COEP 헤더)을 추가

/** 값 없음(value: null)과 읽기 실패(ok: false)를 구분해야 할 때 쓴다 */
export type KvReadResult = { ok: true; value: string | null } | { ok: false };

function warn(action: string, key: string, error: unknown) {
  if (__DEV__) {
    console.warn(`[kvStorage] ${action} ${key} 실패`, error);
  }
}

function read(key: KvKey): KvReadResult {
  try {
    return { ok: true, value: Storage.getItemSync(key) };
  } catch (error) {
    warn('get', key, error);
    return { ok: false };
  }
}

export const kvStorage = {
  /** 읽기에 실패하면 null. 실패와 값 없음을 구분해야 하면 read()를 쓴다 */
  get(key: KvKey): string | null {
    const result = read(key);
    return result.ok ? result.value : null;
  },

  read,

  /** 성공하면 true */
  set(key: KvKey, value: string): boolean {
    try {
      Storage.setItemSync(key, value);
      return true;
    } catch (error) {
      warn('set', key, error);
      return false;
    }
  },

  /** 성공하면 true */
  remove(key: KvKey): boolean {
    try {
      Storage.removeItemSync(key);
      return true;
    } catch (error) {
      warn('remove', key, error);
      return false;
    }
  },
};

// zustand persist용 어댑터. 동기라서 store를 만드는 순간 저장값이 복원된다.
// StateStorage는 키를 string으로 받으므로 KvKey 변환은 이 한 곳에서만 한다.
export const persistStorage: StateStorage = {
  getItem: (name) => kvStorage.get(name as KvKey),
  setItem: (name, value) => kvStorage.set(name as KvKey, value),
  removeItem: (name) => kvStorage.remove(name as KvKey),
};

import Storage from 'expo-sqlite/kv-store';
import type { StateStorage } from 'zustand/middleware';

import type { KvKey } from './keys';

// 동기 API를 쓴다. 오류 처리 규칙은 secureStorage와 같다.

function warn(action: string, key: string, error: unknown) {
  if (__DEV__) {
    console.warn(`[kvStorage] ${action} ${key} 실패`, error);
  }
}

export const kvStorage = {
  get(key: KvKey): string | null {
    try {
      return Storage.getItemSync(key);
    } catch (error) {
      warn('get', key, error);
      return null;
    }
  },

  set(key: KvKey, value: string): void {
    try {
      Storage.setItemSync(key, value);
    } catch (error) {
      warn('set', key, error);
    }
  },

  remove(key: KvKey): void {
    try {
      Storage.removeItemSync(key);
    } catch (error) {
      warn('remove', key, error);
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

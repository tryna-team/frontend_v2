import * as SecureStore from 'expo-secure-store';

import type { SecureKey } from './keys';

// 동기 getItem은 JS 스레드를 멈추고 동기 삭제 API는 없어서 비동기 API만 쓴다.
// 예외는 이 계층에서 끝낸다: 읽기 실패는 값 없음(null), 쓰기·삭제는 성공 여부(boolean)를 돌려주고 개발 모드 경고.

function warn(action: string, key: SecureKey, error: unknown) {
  if (__DEV__) {
    console.warn(`[secureStorage] ${action} ${key} 실패`, error);
  }
}

export const secureStorage = {
  async get(key: SecureKey): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      warn('get', key, error);
      return null;
    }
  },

  /** 성공하면 true */
  async set(key: SecureKey, value: string): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(key, value);
      return true;
    } catch (error) {
      warn('set', key, error);
      return false;
    }
  },

  /** 성공하면 true */
  async remove(key: SecureKey): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      warn('remove', key, error);
      return false;
    }
  },
};

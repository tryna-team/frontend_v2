import * as SecureStore from 'expo-secure-store';

import type { SecureKey } from './keys';

// 동기 getItem은 JS 스레드를 멈추고 동기 삭제 API는 없어서 비동기 API만 쓴다.
// 오류는 이 계층에서 끝낸다: 읽기 실패는 값 없음(null), 쓰기·삭제 실패는 개발 모드 경고.

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

  async set(key: SecureKey, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      warn('set', key, error);
    }
  },

  async remove(key: SecureKey): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      warn('remove', key, error);
    }
  },
};

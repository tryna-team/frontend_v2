import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import type { SecureKey } from './keys';

// 동기 getItem은 JS 스레드를 멈추고 동기 삭제 API는 없어서 비동기 API만 쓴다.
// 예외는 이 계층에서 끝낸다: 읽기 실패는 값 없음(null), 쓰기·삭제는 성공 여부(boolean)를 돌려주고 개발 모드 경고.

// SecureStore는 웹 구현이 없어 웹에서 호출하면 예외가 난다. 웹에서는 저장하지 않고 메모리 값만 쓴다.
// 웹에는 지울 값도 없으므로 remove는 성공으로 처리한다. 그래야 첫 실행 정리가 끝나고 플래그가 기록된다.
// 확인 예정: 웹 로그인 유지 방식(localStorage, HttpOnly 쿠키)이 정해지면 이 분기만 바꾼다
const isWeb = Platform.OS === 'web';

function warn(action: string, key: SecureKey, error: unknown) {
  if (__DEV__) {
    console.warn(`[secureStorage] ${action} ${key} 실패`, error);
  }
}

export const secureStorage = {
  async get(key: SecureKey): Promise<string | null> {
    if (isWeb) {
      return null;
    }

    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      warn('get', key, error);
      return null;
    }
  },

  /** 성공하면 true. 웹에서는 저장하지 않으므로 false */
  async set(key: SecureKey, value: string): Promise<boolean> {
    if (isWeb) {
      return false;
    }

    try {
      await SecureStore.setItemAsync(key, value);
      return true;
    } catch (error) {
      warn('set', key, error);
      return false;
    }
  },

  /** 성공하면 true. 웹에서는 지울 값이 없으므로 true */
  async remove(key: SecureKey): Promise<boolean> {
    if (isWeb) {
      return true;
    }

    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      warn('remove', key, error);
      return false;
    }
  },
};

// 저장소 키는 이 파일에서만 정의한다.
// 저장소별로 객체를 나눠, 토큰 키를 암호화하지 않는 일반 저장소에 넘기는 실수를 타입으로 막는다.
// 웹은 같은 주소의 localStorage를 다른 코드와 함께 쓰므로 모든 키에 tryna_ 접두사를 붙인다.

/** expo-secure-store 키. 영문, 숫자, `.`, `-`, `_`만 허용된다 */
export const SECURE_KEYS = {
  refreshToken: 'tryna_refresh_token',
} as const;

/** 일반 저장소(AsyncStorage) 키 */
export const STORAGE_KEYS = {
  deviceId: 'tryna_device_id',
  memberLoggedIn: 'tryna_member_logged_in',
  conversionPromptShown: 'tryna_conversion_prompt_shown',
  settings: 'tryna_settings',
  hasLaunched: 'tryna_has_launched',
} as const;

export type SecureKey = (typeof SECURE_KEYS)[keyof typeof SECURE_KEYS];
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

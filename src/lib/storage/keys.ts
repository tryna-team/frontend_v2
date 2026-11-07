// 저장소 키는 이 파일에서만 정의한다.
// 저장소별로 객체를 나눠, 토큰 키를 암호화되지 않는 kv-store에 넘기는 실수를 타입으로 막는다.

/** expo-secure-store 키. 영문, 숫자, `.`, `-`, `_`만 허용된다 */
export const SECURE_KEYS = {
  refreshToken: 'tryna_refresh_token',
} as const;

/** expo-sqlite/kv-store 키 */
export const KV_KEYS = {
  deviceId: 'tryna_device_id',
  memberLoggedIn: 'tryna_member_logged_in',
  conversionPromptShown: 'tryna_conversion_prompt_shown',
  settings: 'tryna_settings',
  hasLaunched: 'tryna_has_launched',
} as const;

export type SecureKey = (typeof SECURE_KEYS)[keyof typeof SECURE_KEYS];
export type KvKey = (typeof KV_KEYS)[keyof typeof KV_KEYS];

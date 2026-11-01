/**
 * A101(/users/status), A105, A106 응답의 userRole.
 * NONE은 유효한 토큰 없이 A101을 호출했을 때만 내려온다.
 */
export type UserRole = 'GUEST' | 'USER' | 'NONE';

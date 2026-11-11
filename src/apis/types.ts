// # 공통 API 응답 타입
export type ApiResponse<T = null> = {
  success: boolean;
  code: string;
  message: string;
  data: T | null;
};

// # 공통 API 에러 응답 타입
export type ApiErrorResponse = ApiResponse<null>;

// # 사용자 권한 타입
// GUEST: 비회원, USER: 정식 회원, NONE: 사용자 상태 조회(GET /users/status) 응답과 맞추기 위한 값
export type UserRole = 'GUEST' | 'USER' | 'NONE';

// # 캘린더 타입
// v1(tryna_v1/frontend/src/apis/types/calendar.ts)의 캘린더 타입 중 월간 캘린더에 필요한 것만 옮겼다.
// API 연동 시 B101 응답 타입(CalendarMainResponseData 등)을 함께 추가한다

/** events 도메인 status. "DRAFT"(1차 파싱 단계), "CONFIRMED"(최종 저장 완료)만 확인됨 */
export type EventStatus = 'DRAFT' | 'CONFIRMED' | string;

/** 일정 생성 경로. "USER_NATURAL_LANGUAGE"만 확인됨 (외부 캘린더 연동 일정은 다른 값일 수 있음) */
export type EventSourceType = 'USER_NATURAL_LANGUAGE' | string;

/** 날짜 하나의 일정 요약. B101 응답의 monthlyEventDays 항목 */
export type CalendarEventDaySummary = {
  date: string; // 'YYYY-MM-DD'
  eventCount: number;
  hasEvent: boolean;
  /**
   * 그 날짜에 표시할 일정. 여러 날 일정은 걸친 날짜마다 반복해서 온다.
   * 서버가 미리보기 개수를 제한하면 eventCount보다 적게 올 수 있다.
   */
  previewEvents: CalendarEventDetail[];
};

/** 일정 한 건. B101의 previewEvents·selectedDateEvents, B103의 events가 같은 모양 */
export type CalendarEventDetail = {
  eventId: number;
  title: string;
  startDate: string; // 'YYYY-MM-DD'
  startTime: string | null;
  endDate: string | null; // 'YYYY-MM-DD'. 종일·미정 일정이면 null
  endTime: string | null;
  isAllDay: boolean;
  location: string | null;
  /** 일정에 붙은 라벨. 라벨 목록(B108)의 색상과 이어서 블록 색을 정한다 */
  labelId: number | null;
  sourceType: EventSourceType;
  status: EventStatus;
};

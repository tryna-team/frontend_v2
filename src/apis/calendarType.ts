import type { CalendarEventDetail } from './types';

// # 날짜별 일정 조회 응답 (B103)
export type CalendarDateEventsResponse = {
  date: string;
  eventCount: number;
  emptyStateType: string | null;
  events: CalendarEventDetail[];
};
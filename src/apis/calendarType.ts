import type { CalendarEventDetail, CalendarEventDaySummary } from './types';

// # 날짜별 일정 조회 응답 (B103)
export type CalendarDateEventsResponse = {
  date: string;
  eventCount: number;
  emptyStateType: string | null;
  events: CalendarEventDetail[];
};

// # 월간 캘린더 조회 요청 (B101)
export type CalendarMainRequest = {
  year: number;
  month: number;
  selectedDate: string;
};

// # 월간 캘린더 조회 응답 (B101)
export type CalendarMainResponse = {
  year: number;
  month: number;
  today: string;
  selectedDate: string;
  hasEvents: boolean;
  hasExternalCalendarConnection: boolean;
  emptyStateType: string | null;
  monthlyEventDays: CalendarEventDaySummary[];
  selectedDateEvents: CalendarEventDetail[];
};

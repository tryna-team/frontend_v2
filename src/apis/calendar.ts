import apiClient from './client';
import type { ApiResponse } from './types';
import type { 
    CalendarDateEventsResponse, 
    CalendarMainRequest,
    CalendarMainResponse,
} from './calendarType';

// # 월간 캘린더 조회 (B101)
export async function getCalendarMain(
    request: CalendarMainRequest,
): Promise<CalendarMainResponse> {
    const response = await apiClient.get<ApiResponse<CalendarMainResponse>>(
        '/api/v1/calendars/main',
        { params: request }
    );

    if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message || '월간 캘린더 조회에 실패했습니다.'
    );
  }
    return response.data.data;
}

// # 날짜별 일정 조회 (B103)
export async function getDateEvents(
  date: string,
): Promise<CalendarDateEventsResponse> {
  const response = await apiClient.get<ApiResponse<CalendarDateEventsResponse>>(
    `/api/v1/calendars/dates/${encodeURIComponent(date)}/events`
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.message || '날짜별 일정 조회에 실패했습니다.'
    );
  }

  return response.data.data;
}
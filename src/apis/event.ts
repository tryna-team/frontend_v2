import apiClient from './client';
import type { ApiResponse } from './types';
import type {
  EventCreateRequest,
  EventCreateResponse,
} from './eventType';

// # 일정 생성 (C104)
export async function createEvent(
  request: EventCreateRequest,
): Promise<EventCreateResponse> {
  const response = await apiClient.post<ApiResponse<EventCreateResponse>>(
    '/api/v1/events',
    request,
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '일정 생성에 실패했습니다.');
  }

  return response.data.data;
}
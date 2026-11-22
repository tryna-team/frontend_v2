import apiClient from './client';
import type { ApiResponse } from './types';
import type {
  EventCreateRequest,
  EventCreateResponse,
  EventDetailResponse,
  EventUpdateRequest,
  EventUpdateResponse,
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

// # 일정 상세 조회 (B104)
export async function getEventDetail(
  eventId: number,
): Promise<EventDetailResponse> {
  const response = await apiClient.get<ApiResponse<EventDetailResponse>>(
    `/api/v1/events/${eventId}`,
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '일정 조회에 실패했습니다.');
  }

  return response.data.data;
}

// # 일정 수정 (C107)
export async function updateEvent(
  eventId: number,
  request: EventUpdateRequest
): Promise<EventUpdateResponse> {
  const response = await apiClient.patch<ApiResponse<EventUpdateResponse>>(
    `/api/v1/events/${eventId}`,
    request
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || '일정 수정에 실패했습니다.');
  }

  return response.data.data;
}

import type { EventSourceType, EventStatus } from './types';

// # 공통 타입
export type RecurrenceType =
  | 'NONE'
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'YEARLY'
  | 'CUSTOM';

export type RecurrenceDayOfWeek =
  | 'NONE'
  | 'MON'
  | 'TUE'
  | 'WED'
  | 'THU'
  | 'FRI'
  | 'SAT'
  | 'SUN';

export type EventScope = 'SINGLE' | 'THIS_AND_FUTURE';

export type ActionItemType =
  | 'TIMED_ACTION'
  | 'UNTIMED_PREP'
  | 'UNRESOLVED';

export type ActionItemStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'NEEDS_CONFIRMATION'
  | 'DELETED';

export type ActionItemCreatedBy =
  | 'SYSTEM'
  | 'USER'
  | 'USER_EDITED';

export type ActionFeedbackType =
  | 'SELECTED'
  | 'REJECTED'
  | 'EDITED'
  | 'USER_ADDED';

// # ActionItem 타입
export type ActionItemSaveItem = {
  title: string;
  itemType: ActionItemType;
  occurrenceDate?: string | null;
  displayDate?: string | null;
  displayTime?: string | null;
  offsetDays?: number | null;
  createdBy: ActionItemCreatedBy;
  sourceTemplateId?: string | null;
};

export type ActionItemFeedback = {
  sourceTemplateId?: string | null;
  actionType: ActionFeedbackType;
  originalTitle?: string | null;
  editedTitle?: string | null;
  reason?: string | null;
};

export type ActionItemSaveRequest = {
  items: ActionItemSaveItem[];
  feedbackLogs: ActionItemFeedback[];
};

export type ActionItemSaveResponse = {
  actionItemId: number;
  parentEventId: number;
  occurrenceDate: string | null;
  title: string;
  itemType: ActionItemType;
  displayDate: string | null;
  displayTime: string | null;
  actionItemStatus: ActionItemStatus;
  createdBy: ActionItemCreatedBy;
};

// # 일정 공통 입력 타입
type EventBaseRequest = {
  eventTitle: string;
  description?: string | null;
  startDate?: string | null;
  startTime?: string | null;
  endDate?: string | null;
  endTime?: string | null;
  isAllDay?: boolean | null;
  location?: string | null;
  isRecurring?: boolean | null;
  recurrenceType?: RecurrenceType | null;
  recurrenceInterval?: number | null;
  recurrenceEndDate?: string | null;
  labelId?: number | null;
};

// # 일정 생성 (C104)
export type EventEntityRequest = {
  name: string;
  role: string;
};

export type EventCreateRequest = EventBaseRequest & {
  eventType?: string | null;
  actionItems?: ActionItemSaveRequest | null;
  activityCode?: string | null;
  entities?: EventEntityRequest[] | null;
};

export type EventCreateResponse = {
  eventId: number;
  status: EventStatus;
  sourceType: EventSourceType;
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  recurrenceInterval: number | null;
  recurrenceDayOfWeek: RecurrenceDayOfWeek | null;
  recurrenceDayOfMonth: number | null;
  recurrenceEndDate: string | null;
  labelId: number | null;
  createdAt: string;
  savedActionItems: ActionItemSaveResponse[];
};

// # 일정 상세 조회 (B104)
export type EventDetailResponse = {
  eventId: number;
  eventTitle: string;
  description: string | null;
  startDate: string | null;
  startTime: string | null;
  endDate: string | null;
  endTime: string | null;
  isAllDay: boolean;
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  recurrenceInterval: number | null;
  recurrenceDayOfWeek: RecurrenceDayOfWeek | null;
  recurrenceDayOfMonth: number | null;
  recurrenceEndDate: string | null;
  location: string | null;
  labelId: number | null;
  eventTypeCandidate: string | null;
  eventType: string | null;
  sourceType: EventSourceType;
  status: EventStatus;
  externalEventId: string | null;
  provider: string | null;
};

// # 일정 수정 (C107)
export type EventUpdateActionItem = {
  actionItemId?: number | null;
  title: string;
  itemType: ActionItemType;
  occurrenceDate?: string | null;
  displayDate?: string | null;
  displayTime?: string | null;
  offsetDays?: number | null;
  actionItemStatus?: ActionItemStatus | null;
  createdBy: ActionItemCreatedBy;
  sourceTemplateId?: string | null;
};

export type EventUpdateActionItems = {
  items: EventUpdateActionItem[];
  deletedActionItemIds: number[];
};

export type EventUpdateRequest = EventBaseRequest & {
  occurrenceDate?: string | null;
  updateScope: EventScope;
  actionItems?: EventUpdateActionItems | null;
};

export type EventUpdateResponse = {
  eventId: number;
  updateScope: EventScope;
  updateStatus: EventStatus;
  affectedEventCount: number;
  adjustedActionItemCount: number;
  requiresActionItemReview: boolean;
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  recurrenceInterval: number | null;
  recurrenceDayOfWeek: RecurrenceDayOfWeek | null;
  recurrenceDayOfMonth: number | null;
  recurrenceEndDate: string | null;
  labelId: number | null;
  updatedAt: string;
};

// # 일정 삭제 (C106)
export type EventDeleteRequest = {
  deleteScope: EventScope;
  cascade: boolean;
  occurrenceDate?: string | null;
};

export type EventDeleteResponse = {
  eventId: number;
  deleteScope: EventScope;
  deletionStatus: EventStatus;
  affectedEventCount: number;
  affectedActionItemCount: number;
};

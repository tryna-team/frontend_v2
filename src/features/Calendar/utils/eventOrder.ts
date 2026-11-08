// 일정 순서 규칙. 칸 안의 정렬과 여러 날 일정의 줄 배정 순서를 여기서만 정한다
import type { CalendarEventDetail } from '@/apis/types/calendar';

// # 타입 영역
// 블록 모양(getEventBlockProps)과 정렬 순서를 함께 정하는 일정 종류
export type EventKind = 'multiDay' | 'allDay' | 'untimed' | 'timed';

export type MultiDayEvent = CalendarEventDetail & { endDate: string };

// # 상수 영역
// 칸 안에서 위에서부터 놓는 순서. 순서를 바꾸려면 이 배열만 고친다
export const EVENT_KIND_ORDER: EventKind[] = ['multiDay', 'allDay', 'untimed', 'timed'];

// # 함수 영역
// ## 일정 종류
export function isMultiDayEvent(event: CalendarEventDetail): event is MultiDayEvent {
  return event.endDate != null && event.endDate > event.startDate;
}

// 여러 날 일정은 하루종일이어도 여러 날로 본다 (하루종일 표시는 블록 아이콘으로 한다)
export function getEventKind(event: CalendarEventDetail): EventKind {
  if (isMultiDayEvent(event)) return 'multiDay';
  if (event.isAllDay) return 'allDay';
  if (event.startTime == null) return 'untimed';
  return 'timed';
}

// ## 칸 안의 일정 순서: 종류 → 시작 시간 → eventId
// 같은 순위면 eventId가 작은 일정을 먼저 두어, 다시 그려도 순서가 바뀌지 않게 한다
export function compareEvents(a: CalendarEventDetail, b: CalendarEventDetail): number {
  const kindDiff =
    EVENT_KIND_ORDER.indexOf(getEventKind(a)) - EVENT_KIND_ORDER.indexOf(getEventKind(b));
  if (kindDiff !== 0) return kindDiff;

  const timeDiff = (a.startTime ?? '').localeCompare(b.startTime ?? '');
  if (timeDiff !== 0) return timeDiff;

  return a.eventId - b.eventId;
}

// ## 여러 날 일정의 줄 배정 순서: 먼저 시작 → 늦게 끝남(긴 일정) → eventId
// 이 순서대로 겹치지 않는 가장 위 줄을 차지한다
export function compareMultiDayEvents(a: MultiDayEvent, b: MultiDayEvent): number {
  if (a.startDate !== b.startDate) return a.startDate < b.startDate ? -1 : 1;
  if (a.endDate !== b.endDate) return a.endDate > b.endDate ? -1 : 1;
  return a.eventId - b.eventId;
}

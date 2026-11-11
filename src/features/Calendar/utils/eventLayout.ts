import type { CalendarEventDaySummary, CalendarEventDetail } from '@/apis/types';
import { tempDesignValues } from '@/theme/tempDesignValues';
import type {
  CalendarWeek,
  DayEventLayout,
  EventBlockEdge,
  EventBlockProps,
  EventSlot,
} from '../CalendarType';
import {
  compareEvents,
  compareMultiDayEvents,
  getEventKind,
  isMultiDayEvent,
  type MultiDayEvent,
} from './eventOrder';

// # 상수 영역
// Figma Events의 Size가 0~4라 한 칸에 4줄까지 표시하고 나머지는 숨긴다
// TODO: 초과 일정 표시(+N) 디자인이 정해지면 마지막 줄을 비워 두고 Events에서 남은 개수를 표시한다
const MAX_EVENT_LINES = 4;
const { eventBlock } = tempDesignValues;

// # 타입 영역
// 여러 날 일정이 한 주 안에서 보이는 구간
type MultiDaySegment = {
  event: MultiDayEvent;
  startIndex: number; // week.days 안의 위치
  endIndex: number;
  line: number;
  block: EventBlockProps;
};

// # 함수 영역
// ## 날짜별 일정 요약을 날짜 키로 찾을 수 있게 바꾼다
export function groupEventDaysByDate(
  eventDays: CalendarEventDaySummary[],
): Record<string, CalendarEventDaySummary> {
  return Object.fromEntries(eventDays.map((eventDay) => [eventDay.date, eventDay]));
}

// ## 일정 → 블록 표시 값. 어떤 일정을 어떤 Figma 변형으로 그릴지는 여기서만 정한다
// TODO: 라벨별 색이 정해지면 labelId로 찾은 색을 color로 넘긴다
export function getEventBlockProps(
  event: CalendarEventDetail,
  span = 1,
  edge: EventBlockEdge = 'none',
): EventBlockProps {
  const isTimed = getEventKind(event) === 'timed';

  return {
    title: event.title,
    // 'HH:mm:ss'로 와도 Figma처럼 시:분만 표시한다
    time: isTimed ? event.startTime?.slice(0, 5) : undefined,
    labelStyle: event.isAllDay ? 'textAndIcon' : 'textOnly',
    detail: isTimed,
    span,
    edge,
  };
}

// ## 블록 높이 (Figma 값)
function getEventBlockHeight({ labelStyle, detail }: EventBlockProps): number {
  if (detail) return eventBlock.height.detail;
  return labelStyle === 'textAndIcon' ? eventBlock.height.icon : eventBlock.height.text;
}

// ## 앞뒤 주(또는 달)로 이어지는 쪽
function getEdge(continuesBefore: boolean, continuesAfter: boolean): EventBlockEdge {
  if (continuesBefore && continuesAfter) return 'both';
  if (continuesBefore) return 'left';
  if (continuesAfter) return 'right';
  return 'none';
}

// ## 여러 날 일정의 주 단위 구간과 줄
// 서버는 일정이 걸친 날짜마다 같은 일정을 반복해서 주므로 eventId로 하나만 남긴 뒤,
// eventOrder의 순서대로 겹치지 않는 가장 위 줄을 배정한다
function getMultiDaySegments(
  week: CalendarWeek,
  eventDaysByDate: Record<string, CalendarEventDaySummary>,
) {
  const { days } = week;
  const weekStart = days[0].date;
  const weekEnd = days[days.length - 1].date;

  const events = new Map<number, MultiDayEvent>();
  for (const day of days) {
    for (const event of eventDaysByDate[day.date]?.previewEvents ?? []) {
      if (isMultiDayEvent(event)) events.set(event.eventId, event);
    }
  }

  const segments: MultiDaySegment[] = [];
  const lineEnds: number[] = []; // 줄마다 마지막으로 차지한 칸
  const lineHeights: number[] = []; // 줄마다 가장 높은 블록 높이

  for (const event of [...events.values()].sort(compareMultiDayEvents)) {
    const continuesBefore = event.startDate < weekStart;
    const continuesAfter = event.endDate > weekEnd;
    const startIndex = continuesBefore ? 0 : days.findIndex(({ date }) => date === event.startDate);
    const endIndex = continuesAfter
      ? days.length - 1
      : days.findIndex(({ date }) => date === event.endDate);

    const freeLine = lineEnds.findIndex((end) => end < startIndex);
    const line = freeLine < 0 ? lineEnds.length : freeLine;
    lineEnds[line] = endIndex;

    const block = getEventBlockProps(
      event,
      endIndex - startIndex + 1,
      getEdge(continuesBefore, continuesAfter),
    );
    lineHeights[line] = Math.max(lineHeights[line] ?? 0, getEventBlockHeight(block));
    segments.push({ event, startIndex, endIndex, line, block });
  }

  return { segments, lineHeights };
}

// ## 한 주의 칸별 일정 줄
// 여러 날 일정을 위쪽 줄에 놓고, 그 아래에 하루 일정을 eventOrder 순서로 채운다
export function getWeekEventLayout(
  week: CalendarWeek,
  eventDaysByDate: Record<string, CalendarEventDaySummary>,
): Record<string, DayEventLayout> {
  const { segments, lineHeights } = getMultiDaySegments(week, eventDaysByDate);
  const layouts: Record<string, DayEventLayout> = {};

  week.days.forEach((day, index) => {
    const eventDay = eventDaysByDate[day.date];
    const slots: EventSlot[] = [];

    // 이 칸을 지나는 여러 날 일정 중 가장 아래 줄까지 채운다. 블록이 없는 줄도 빈 줄로 둬야 칸끼리 위치가 맞는다
    const passing = segments.filter(
      ({ startIndex, endIndex }) => startIndex <= index && index <= endIndex,
    );
    const lastLine = Math.max(-1, ...passing.map(({ line }) => line));

    for (let line = 0; line <= lastLine; line += 1) {
      const segment = passing.find((item) => item.line === line);
      const startsHere = segment?.startIndex === index;

      slots.push({
        key: startsHere ? `event-${segment.event.eventId}` : `line-${line}`,
        height: lineHeights[line],
        block: startsHere ? segment.block : undefined,
      });
    }

    const singleDayEvents = (eventDay?.previewEvents ?? [])
      .filter((event) => !isMultiDayEvent(event))
      .sort(compareEvents);

    for (const event of singleDayEvents) {
      const block = getEventBlockProps(event);
      slots.push({ key: `event-${event.eventId}`, height: getEventBlockHeight(block), block });
    }

    if (slots.length > 0) {
      layouts[day.date] = {
        slots: slots.slice(0, MAX_EVENT_LINES),
        eventCount: eventDay?.eventCount ?? 0,
      };
    }
  });

  return layouts;
}

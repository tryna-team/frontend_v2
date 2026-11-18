import type { CalendarEventDaySummary, CalendarEventDetail } from '@/apis/types';
import { tempDesignValues } from '@/theme/tempDesignValues';
import type {
  CalendarWeek,
  DayEventLayout,
  EventBlockEdge,
  EventBlockProps,
  EventSlot,
  MonthlyViewMode,
} from '../CalendarType';
import {
  compareEvents,
  compareMultiDayEvents,
  getEventKind,
  isMultiDayEvent,
  type MultiDayEvent,
} from './eventOrder';

// # 상수 영역
// Figma Events의 Size가 0~4라 한 칸에 4줄까지 그린다. 일정이 넘칠 때는 +N 줄도 이 4줄에 포함한다
const MAX_EVENT_LINES = 4;
const { calendarDay, dayBlock, eventBlock, events } = tempDesignValues;

// # 타입 영역
// 여러 날 일정이 한 주 안에서 지나가는 구간
type MultiDaySegment = {
  event: MultiDayEvent;
  startIndex: number; // week.days 안의 위치
  endIndex: number;
  continuesBefore: boolean; // 앞 주(또는 달)에서 이어진다
  continuesAfter: boolean; // 다음 주(또는 달)로 이어진다
  line: number;
};

// 칸에 그릴 수 있는 줄. 여러 날 일정 줄을 먼저 두고, 하루 일정을 그 아래에 둔다
type LineCandidate = {
  height: number;
  eventId?: number; // 이 칸에 보이는 일정. 다른 칸의 여러 날 일정만 지나가는 빈 줄이면 없다
  block?: EventBlockProps; // 하루 일정 블록. 여러 날 일정 블록은 칸마다 보일 줄이 정해진 뒤 만든다
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
  viewMode: MonthlyViewMode,
  span = 1,
  edge: EventBlockEdge = 'none',
): EventBlockProps {
  const isSummary = viewMode === 'summary';
  // 요약형은 일정 영역(55)이 작아 시간 일정도 Detail(높이 45) 대신 한 줄로 그리고 시간은 표시하지 않는다
  const detail = !isSummary && getEventKind(event) === 'timed';

  return {
    title: event.title,
    // 'HH:mm:ss'로 와도 Figma처럼 시:분만 표시한다
    time: detail ? event.startTime?.slice(0, 5) : undefined,
    labelStyle: event.isAllDay ? 'textAndIcon' : 'textOnly',
    detail,
    fadeOverflow: isSummary,
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

// ## 칸에서 일정이 쓸 수 있는 높이 (요약형 55, 상세형 145)
// Day Block 높이에서 날짜 숫자와 위아래 여백을 뺀다
function getEventsAreaHeight(viewMode: MonthlyViewMode): number {
  return (
    dayBlock.contentHeight[viewMode] -
    dayBlock.contentPaddingTop -
    calendarDay.size -
    dayBlock.contentGap -
    dayBlock.contentPaddingBottom
  );
}

// ## 줄을 쌓은 높이 (줄 사이 간격 포함)
function getLinesHeight(heights: number[]): number {
  if (heights.length === 0) return 0;
  return heights.reduce((sum, height) => sum + height, 0) + events.gap * (heights.length - 1);
}

// ## 칸에 보일 줄 수와 +N으로 표시할 일정 수
// 모든 줄이 칸에 들어가고 서버가 미리보기에서 뺀 일정도 없으면 다 보인다.
// 아니면 마지막 줄을 +N에 쓰고, 그 위로 칸에 들어가는 만큼만 보인다
function fitLines(candidates: LineCandidate[], eventCount: number, areaHeight: number) {
  const fits = (count: number, withMore: boolean) => {
    const heights = candidates.slice(0, count).map(({ height }) => height);
    if (withMore) heights.push(events.moreHeight);
    return heights.length <= MAX_EVENT_LINES && getLinesHeight(heights) <= areaHeight;
  };
  const countEvents = (count: number) =>
    candidates.slice(0, count).filter(({ eventId }) => eventId !== undefined).length;

  // eventCount는 서버가 센 그 날의 일정 수다. 미리보기(previewEvents)보다 많으면 나머지도 +N에 더한다
  const totalCount = Math.max(eventCount, countEvents(candidates.length));

  if (countEvents(candidates.length) === totalCount && fits(candidates.length, false)) {
    return { visibleCount: candidates.length, hiddenCount: 0 };
  }

  let visibleCount = candidates.length;
  while (visibleCount > 0 && !fits(visibleCount, true)) visibleCount -= 1;

  return { visibleCount, hiddenCount: totalCount - countEvents(visibleCount) };
}

// ## 여러 날 일정의 주 단위 구간과 줄
// 서버는 일정이 걸친 날짜마다 같은 일정을 반복해서 주므로 eventId로 하나만 남긴 뒤,
// eventOrder의 순서대로 겹치지 않는 가장 위 줄을 배정한다
function getMultiDaySegments(
  week: CalendarWeek,
  eventDaysByDate: Record<string, CalendarEventDaySummary>,
  viewMode: MonthlyViewMode,
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

    // 블록 높이는 칸 수·모서리와 관계없이 일정 종류로 정해진다
    const height = getEventBlockHeight(getEventBlockProps(event, viewMode));
    lineHeights[line] = Math.max(lineHeights[line] ?? 0, height);
    segments.push({ event, startIndex, endIndex, continuesBefore, continuesAfter, line });
  }

  return { segments, lineHeights };
}

// ## 여러 날 일정 블록: '칸-줄' → 그 칸에서 시작하는 블록
// 그 줄이 보이는 칸끼리 이어서 블록 하나로 그린다. 중간 칸에서 +N 때문에 줄이 가려지면
// 블록을 그 칸 앞뒤로 나누고, 나뉜 쪽 모서리는 이어지는 모양(직각)으로 둔다
function getMultiDayBlocks(
  segments: MultiDaySegment[],
  visibleCounts: number[],
  viewMode: MonthlyViewMode,
) {
  const blocks = new Map<string, EventBlockProps>();

  for (const segment of segments) {
    const { event, startIndex, endIndex, line } = segment;
    let runStart = -1;

    // 구간 끝 다음 칸까지 돌아, 마지막으로 이어진 구간도 같은 방식으로 닫는다
    for (let index = startIndex; index <= endIndex + 1; index += 1) {
      const isVisible = index <= endIndex && line < visibleCounts[index];

      if (isVisible && runStart < 0) runStart = index;
      if (isVisible || runStart < 0) continue;

      const runEnd = index - 1;
      const edge = getEdge(
        runStart > startIndex || segment.continuesBefore,
        runEnd < endIndex || segment.continuesAfter,
      );
      blocks.set(
        `${runStart}-${line}`,
        getEventBlockProps(event, viewMode, runEnd - runStart + 1, edge),
      );
      runStart = -1;
    }
  }

  return blocks;
}

// ## 한 주의 칸별 일정 줄
// 여러 날 일정을 위쪽 줄에 놓고, 그 아래에 하루 일정을 eventOrder 순서로 채운다.
// 칸(일정 영역)에 들어가는 만큼만 그리고, 넘치면 마지막 줄에 남은 일정 수(+N)를 표시한다
export function getWeekEventLayout(
  week: CalendarWeek,
  eventDaysByDate: Record<string, CalendarEventDaySummary>,
  viewMode: MonthlyViewMode,
): Record<string, DayEventLayout> {
  const { segments, lineHeights } = getMultiDaySegments(week, eventDaysByDate, viewMode);
  const areaHeight = getEventsAreaHeight(viewMode);

  // 1. 칸마다 그릴 수 있는 줄을 모으고, 칸에 보일 줄 수를 정한다
  const cells = week.days.map((day, index) => {
    const eventDay = eventDaysByDate[day.date];
    const eventCount = eventDay?.eventCount ?? 0;
    const candidates: LineCandidate[] = [];

    // 이 칸을 지나는 여러 날 일정 중 가장 아래 줄까지 채운다. 블록이 없는 줄도 빈 줄로 둬야 칸끼리 위치가 맞는다
    const passing = segments.filter(
      ({ startIndex, endIndex }) => startIndex <= index && index <= endIndex,
    );
    const lastLine = Math.max(-1, ...passing.map(({ line }) => line));

    for (let line = 0; line <= lastLine; line += 1) {
      const segment = passing.find((item) => item.line === line);
      candidates.push({ height: lineHeights[line], eventId: segment?.event.eventId });
    }

    const singleDayEvents = (eventDay?.previewEvents ?? [])
      .filter((event) => !isMultiDayEvent(event))
      .sort(compareEvents);

    for (const event of singleDayEvents) {
      const block = getEventBlockProps(event, viewMode);
      candidates.push({ height: getEventBlockHeight(block), eventId: event.eventId, block });
    }

    return { candidates, eventCount, ...fitLines(candidates, eventCount, areaHeight) };
  });

  // 2. 여러 날 일정 블록은 칸마다 보일 줄이 정해진 뒤에 만든다
  const multiDayBlocks = getMultiDayBlocks(
    segments,
    cells.map(({ visibleCount }) => visibleCount),
    viewMode,
  );

  // 3. 칸마다 보일 줄만 남긴다
  const layouts: Record<string, DayEventLayout> = {};

  week.days.forEach((day, index) => {
    const { candidates, eventCount, visibleCount, hiddenCount } = cells[index];

    const slots: EventSlot[] = candidates.slice(0, visibleCount).map((candidate, line) => {
      if (candidate.block) {
        return { key: `event-${candidate.eventId}`, height: candidate.height, block: candidate.block };
      }

      // 여러 날 일정 줄: 이 칸에서 시작하는 블록이 없으면 다른 칸의 블록이 지나가는 빈 줄이다
      const block = multiDayBlocks.get(`${index}-${line}`);
      return { key: block ? `event-${candidate.eventId}` : `line-${line}`, height: candidate.height, block };
    });

    if (slots.length > 0 || hiddenCount > 0) {
      layouts[day.date] = { slots, eventCount, hiddenCount };
    }
  });

  return layouts;
}

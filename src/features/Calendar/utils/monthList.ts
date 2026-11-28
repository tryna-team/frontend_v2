import { tempDesignValues } from '@/theme/tempDesignValues';
import { toMonthKey } from '@/utils/date';
import { MAX_YEAR, MIN_YEAR, MONTH_WINDOW, isSupportedYear } from './listWindow';
import { getCalendarBodyHeight, getWeekBottom } from './monthGrid';
import type { CalendarMonth, MonthlyViewMode } from '../CalendarType';

// # 상수 영역
const MONTHS_IN_YEAR = 12;
const { monthList } = tempDesignValues;

// # 타입 영역
// 달마다 목록에서 차지하는 높이와 위치. 첫 달의 맨 위가 0이다.
// 스크롤 콘텐츠의 상단 여백(Header 높이)을 빼고 계산해야 scrollToIndex·initialScrollIndex가
// 달의 맨 위를 Header 바로 아래에 맞춘다
export type MonthListLayout = {
  bodyHeights: number[]; // Calendar Body 높이 (달 사이 간격 제외)
  lengths: number[]; // Calendar Body + 달 사이 간격. FlatList의 getItemLayout에 쓴다
  offsets: number[];
  totalLength: number;
};

// # 함수 영역
// 연·월을 하나의 수로 바꿔서, 달끼리 몇 개월 차이인지 바로 계산한다
const toMonthNumber = (year: number, month: number) => year * MONTHS_IN_YEAR + (month - 1);

// 다룰 수 있는 첫 달과 마지막 달
const FIRST_MONTH_NUMBER = toMonthNumber(MIN_YEAR, 1);
const LAST_MONTH_NUMBER = toMonthNumber(MAX_YEAR, MONTHS_IN_YEAR);

// ## 월 번호 from~to의 연속한 달. 다룰 수 있는 연도 밖의 달은 뺀다
function createMonths(from: number, to: number): CalendarMonth[] {
  const first = Math.max(from, FIRST_MONTH_NUMBER);
  const last = Math.min(to, LAST_MONTH_NUMBER);

  return Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => {
    const year = Math.floor((first + index) / MONTHS_IN_YEAR);
    const month = ((first + index) % MONTHS_IN_YEAR) + 1;

    return { key: toMonthKey(year, month), year, month };
  });
}

// ## 월 목록 범위 (당겨오는 개월 수는 utils/listWindow의 MONTH_WINDOW)
// ### 처음 목록: 기준 날짜가 속한 달의 앞뒤 MONTH_WINDOW.initialRange개월
export function createMonthWindow(baseDate: string): CalendarMonth[] {
  const [baseYear, baseMonth] = baseDate.split('-').map(Number);
  const base = toMonthNumber(baseYear, baseMonth);

  return createMonths(base - MONTH_WINDOW.initialRange, base + MONTH_WINDOW.initialRange);
}

// ### 첫 달 바로 앞의 count개월. 목록 앞에 붙일 달이다
export function getMonthsBefore(months: CalendarMonth[], count: number): CalendarMonth[] {
  const first = toMonthNumber(months[0].year, months[0].month);
  return createMonths(first - count, first - 1);
}

// ### 마지막 달 바로 뒤의 count개월. 목록 뒤에 붙일 달이다
export function getMonthsAfter(months: CalendarMonth[], count: number): CalendarMonth[] {
  const lastMonth = months[months.length - 1];
  const last = toMonthNumber(lastMonth.year, lastMonth.month);
  return createMonths(last + 1, last + count);
}

// ### 목록 밖의 달까지 늘린 목록. 옮긴 뒤 바로 끝에 닿지 않게 그 달 너머로 MONTH_WINDOW.loadCount개월을 더 붙인다
// 목록 안의 달이면 같은 목록을 그대로 돌려준다
export function extendMonthsToInclude(
  months: CalendarMonth[],
  year: number,
  month: number,
): CalendarMonth[] {
  const target = toMonthNumber(year, month);
  const first = toMonthNumber(months[0].year, months[0].month);
  const lastMonth = months[months.length - 1];
  const last = toMonthNumber(lastMonth.year, lastMonth.month);

  if (target < first) {
    return [...createMonths(target - MONTH_WINDOW.loadCount, first - 1), ...months];
  }

  if (target > last) {
    return [...months, ...createMonths(last + 1, target + MONTH_WINDOW.loadCount)];
  }

  return months;
}

// ## 목록을 그 달까지 늘릴 수 있는지
export function isSupportedMonth(year: number, month: number): boolean {
  return isSupportedYear(year) && Number.isInteger(month) && month >= 1 && month <= 12;
}

// ## 연·월이 목록의 몇 번째인지. 목록 밖이면 -1
export function getMonthIndex(months: CalendarMonth[], year: number, month: number): number {
  const index = toMonthNumber(year, month) - toMonthNumber(months[0].year, months[0].month);
  return index >= 0 && index < months.length ? index : -1;
}

// ## 'YYYY-MM' 키가 목록의 몇 번째인지. 목록 밖이면 -1
export function getMonthKeyIndex(months: CalendarMonth[], key: string): number {
  const [year, month] = key.split('-').map(Number);
  return getMonthIndex(months, year, month);
}

// ## 달마다 차지하는 높이와 위치
// 마지막 달에도 간격을 붙여, 모든 달의 길이를 같은 식으로 계산한다
export function getMonthListLayout(
  months: CalendarMonth[],
  viewMode: MonthlyViewMode,
): MonthListLayout {
  const gap = monthList.gap[viewMode];
  const bodyHeights = months.map(({ year, month }) => getCalendarBodyHeight(year, month, viewMode));
  const lengths = bodyHeights.map((height) => height + gap);
  const offsets: number[] = [];
  let totalLength = 0;

  for (const length of lengths) {
    offsets.push(totalLength);
    totalLength += length;
  }

  return { bodyHeights, lengths, offsets, totalLength };
}

// ## 위치가 속한 달. offsets가 오름차순이라 이진 탐색으로 찾는다
function findMonthAt(offsets: number[], position: number): number {
  let low = 0;
  let high = offsets.length - 1;

  while (low < high) {
    const middle = Math.ceil((low + high) / 2);

    if (offsets[middle] <= position) {
      low = middle;
    } else {
      high = middle - 1;
    }
  }

  return low;
}

// ## 보이는 영역에서 가장 많이 보이는 달
// 영역은 목록 좌표의 [위, 아래]이고, 달 사이 간격은 어느 달에도 넣지 않는다.
// 보이는 높이가 같으면 지금 달을 그대로 두어 제목이 번갈아 바뀌지 않게 한다
export function getMostVisibleMonthIndex(
  layout: MonthListLayout,
  regionTop: number,
  regionBottom: number,
  currentIndex: number,
): number {
  const { bodyHeights, offsets } = layout;
  const getVisibleHeight = (index: number) =>
    Math.max(
      0,
      Math.min(offsets[index] + bodyHeights[index], regionBottom) -
        Math.max(offsets[index], regionTop),
    );

  let bestIndex = currentIndex;
  let bestHeight = getVisibleHeight(currentIndex);

  for (
    let index = findMonthAt(offsets, regionTop);
    index < offsets.length && offsets[index] < regionBottom;
    index += 1
  ) {
    const height = getVisibleHeight(index);

    if (height > bestHeight) {
      bestIndex = index;
      bestHeight = height;
    }
  }

  return bestIndex;
}

// ## 스크롤 위치를 목록 끝에서 멈춘다. 마지막 달 아래로 넘어가지 않게 한다
function clampScrollOffset(layout: MonthListLayout, offset: number, regionHeight: number): number {
  return Math.min(offset, Math.max(0, layout.totalLength - regionHeight));
}

// ## 달로 이동할 스크롤 위치. 달 맨 위를 보이는 영역의 위 끝에 맞춘다
// 목록 밖의 달(다룰 수 있는 연도 밖)이면 가장 가까운 끝 달로 간다
export function getMonthScrollOffset(
  months: CalendarMonth[],
  layout: MonthListLayout,
  year: number,
  month: number,
  regionHeight: number,
): number {
  const index = Math.min(
    Math.max(toMonthNumber(year, month) - toMonthNumber(months[0].year, months[0].month), 0),
    months.length - 1,
  );

  return clampScrollOffset(layout, layout.offsets[index], regionHeight);
}

// ## 날짜로 이동할 스크롤 위치. 목록 밖의 날짜면 null
// 달 맨 위를 보이는 영역의 위 끝에 맞추고, 그 날짜의 주가 영역 아래로 잘리면 주의 아래 끝까지 보이도록 더 내린다
export function getDateScrollOffset(
  months: CalendarMonth[],
  layout: MonthListLayout,
  date: string,
  viewMode: MonthlyViewMode,
  regionHeight: number,
): number | null {
  const [year, month, day] = date.split('-').map(Number);
  const index = getMonthIndex(months, year, month);

  if (index < 0) return null;

  const monthTop = layout.offsets[index];
  const weekBottom = monthTop + getWeekBottom(year, month, day, viewMode);
  const offset = Math.max(monthTop, weekBottom - regionHeight);

  return clampScrollOffset(layout, offset, regionHeight);
}

import { tempDesignValues } from '@/theme/tempDesignValues';
import { getCalendarBodyHeight, getWeekBottom } from './monthGrid';
import type { CalendarMonth, MonthlyViewMode } from '../CalendarType';

// # 상수 영역
// 화면을 연 달 기준으로 앞뒤에 둘 개월 수 (앞뒤 각 5년)
export const MONTH_RANGE = 60;
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

// ## 월 목록: 기준 날짜가 속한 달의 앞뒤 MONTH_RANGE개월
export function getMonthList(baseDate: string): CalendarMonth[] {
  const [baseYear, baseMonth] = baseDate.split('-').map(Number);
  const first = toMonthNumber(baseYear, baseMonth) - MONTH_RANGE;

  return Array.from({ length: MONTH_RANGE * 2 + 1 }, (_, index) => {
    const year = Math.floor((first + index) / MONTHS_IN_YEAR);
    const month = ((first + index) % MONTHS_IN_YEAR) + 1;

    return { key: `${year}-${String(month).padStart(2, '0')}`, year, month };
  });
}

// ## 연·월이 목록의 몇 번째인지. 목록 밖이면 -1
export function getMonthIndex(months: CalendarMonth[], year: number, month: number): number {
  const index = toMonthNumber(year, month) - toMonthNumber(months[0].year, months[0].month);
  return index >= 0 && index < months.length ? index : -1;
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

// ## 날짜로 이동할 스크롤 위치. 목록 밖의 날짜면 null
// 달 맨 위를 보이는 영역의 위 끝에 맞추고, 그 날짜의 주가 영역 아래로 잘리면 주의 아래 끝까지 보이도록 더 내린다.
// 마지막 달 아래로 넘어가지 않게 목록 끝에서 멈춘다
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

  return Math.min(offset, Math.max(0, layout.totalLength - regionHeight));
}

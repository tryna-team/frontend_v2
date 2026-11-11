import { tempDesignValues } from '@/theme/tempDesignValues';
import { toDateKey } from '@/utils/date';
import type { CalendarDate, CalendarWeek, MonthlyViewMode } from '../CalendarType';

// # 상수 영역
const DAYS_IN_WEEK = 7;
const SATURDAY = 6;
const { dateTitle, dayBlock, weekBody } = tempDesignValues;
// 첫 주는 1일 칸 위의 월 제목만큼 높다
const MONTH_TITLE_HEIGHT = dateTitle.smallHeight + dayBlock.titleGap;

// 일요일 시작. dayOfWeek(0~6)로 찾는다
export const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const;

// # 함수 영역
// ## 달의 주 목록
// 일요일 시작 기준으로 그 달의 날짜를 주 단위로 나눈다. month는 1~12
export function getMonthWeeks(year: number, month: number): CalendarWeek[] {
  const lastDay = new Date(year, month, 0).getDate();
  const weeks: CalendarWeek[] = [];
  let days: CalendarDate[] = [];

  for (let day = 1; day <= lastDay; day += 1) {
    // 'YYYY-MM-DD' 문자열을 new Date()에 넘기면 UTC로 해석되므로 연·월·일로 만든다
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();

    days.push({ date: toDateKey(date), year, month, day, dayOfWeek, isFirstDay: day === 1 });

    if (dayOfWeek === SATURDAY || day === lastDay) {
      weeks.push({ year, month, weekIndex: weeks.length, days });
      days = [];
    }
  }

  return weeks;
}

// ## 높이
// 칸 높이가 고정이라 주 수와 주의 위치만으로 정해진다. 월 목록에서 스크롤 위치를 계산할 때 쓴다
function getWeekHeight(viewMode: MonthlyViewMode): number {
  return weekBody.paddingTop + dayBlock.contentHeight[viewMode] + weekBody.paddingBottom;
}

// 날짜가 그 달의 몇 번째 주인지 (0부터). 첫 주 앞의 빈 칸(1일의 요일)만큼 더해서 센다
function getWeekIndex(year: number, month: number, day: number): number {
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  return Math.floor((firstDayOfWeek + day - 1) / DAYS_IN_WEEK);
}

// ### Calendar Body 높이
export function getCalendarBodyHeight(
  year: number,
  month: number,
  viewMode: MonthlyViewMode,
): number {
  const lastDay = new Date(year, month, 0).getDate();
  const weekCount = getWeekIndex(year, month, lastDay) + 1;

  return MONTH_TITLE_HEIGHT + getWeekHeight(viewMode) * weekCount;
}

// ### 날짜가 있는 주의 아래 끝. Calendar Body 맨 위가 0이다
export function getWeekBottom(
  year: number,
  month: number,
  day: number,
  viewMode: MonthlyViewMode,
): number {
  return MONTH_TITLE_HEIGHT + getWeekHeight(viewMode) * (getWeekIndex(year, month, day) + 1);
}

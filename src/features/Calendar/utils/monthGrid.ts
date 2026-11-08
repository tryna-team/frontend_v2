import { tempDesignValues } from '@/theme/tempDesignValues';
import type { CalendarDate, CalendarWeek, MonthlyViewMode } from '../CalendarType';

// # 상수 영역
const DAYS_IN_WEEK = 7;
const SATURDAY = 6;

// 일요일 시작. dayOfWeek(0~6)로 찾는다
export const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const;

// # 함수 영역
// ## 날짜 키
// TODO: zustand 병합 후 src/utils/date.ts의 toDateKey로 교체 (같은 형식이라 import만 바꾼다)
const pad2 = (value: number) => String(value).padStart(2, '0');

// Date → 'YYYY-MM-DD'. toISOString()은 UTC라 기기 로컬 시간으로 만든다
function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

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

// ## Calendar Body 높이
// 칸 높이가 고정이라 주 수만으로 정해진다. 월 목록에서 스크롤 위치를 계산할 때 쓴다
export function getCalendarBodyHeight(
  year: number,
  month: number,
  viewMode: MonthlyViewMode,
): number {
  const { dateTitle, dayBlock, weekBody } = tempDesignValues;

  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const lastDay = new Date(year, month, 0).getDate();
  const weekCount = Math.ceil((firstDayOfWeek + lastDay) / DAYS_IN_WEEK);

  const weekHeight =
    weekBody.paddingTop + dayBlock.contentHeight[viewMode] + weekBody.paddingBottom;
  // 첫 주는 1일 칸 위의 월 제목만큼 높다
  const titleHeight = dateTitle.smallHeight + dayBlock.titleGap;

  return weekHeight * weekCount + titleHeight;
}

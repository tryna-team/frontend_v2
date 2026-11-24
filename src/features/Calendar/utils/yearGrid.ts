import { tempDesignValues } from '@/theme/tempDesignValues';

// # 상수 영역
const MONTHS_IN_YEAR = 12;
const DAYS_IN_WEEK = 7;
const { calendarDay, dateTitle, yearMonth, yearSection } = tempDesignValues;

// ## 한 해의 달 배치. Figma처럼 한 줄에 세 달씩 놓는다 ([[1, 2, 3], [4, 5, 6], ...])
export const MONTH_ROWS: number[][] = Array.from(
  { length: MONTHS_IN_YEAR / yearSection.monthsPerRow },
  (_, row) =>
    Array.from(
      { length: yearSection.monthsPerRow },
      (_, column) => row * yearSection.monthsPerRow + column + 1,
    ),
);

// ## 크기
// 칸 크기와 주 수가 고정이라 모든 달과 모든 해의 크기가 같다. 연도 목록의 스크롤 위치 계산에 쓴다
// ### 월 캘린더 폭: 7칸과 칸 사이 간격 (Figma 111)
export const YEAR_MONTH_WIDTH =
  DAYS_IN_WEEK * calendarDay.yearlySize + (DAYS_IN_WEEK - 1) * yearMonth.dayGap;

// ### 월 캘린더의 날짜 영역 높이. 그 달의 주 수와 관계없이 yearMonth.weekCount주 높이로 고정한다
export const YEAR_MONTH_BODY_HEIGHT =
  yearMonth.weekCount * calendarDay.yearlySize + (yearMonth.weekCount - 1) * yearMonth.weekGap;

const YEAR_MONTH_HEIGHT = yearMonth.titleHeight + yearMonth.titleGap + YEAR_MONTH_BODY_HEIGHT;

// ### 한 해 높이: 연도 제목 줄 + 월 줄 (해 사이 간격 제외)
export const YEAR_SECTION_HEIGHT =
  yearSection.headerPaddingVertical * 2 +
  dateTitle.largeHeight +
  yearSection.bodyPaddingTop +
  MONTH_ROWS.length * YEAR_MONTH_HEIGHT +
  (MONTH_ROWS.length - 1) * yearSection.rowGap;

import { tempDesignValues } from '@/theme/tempDesignValues';
import { MAX_YEAR, MIN_YEAR, YEAR_WINDOW } from './listWindow';
import { YEAR_SECTION_HEIGHT } from './yearGrid';

// # 상수 영역
const { yearList } = tempDesignValues;

// 목록에서 한 해가 차지하는 길이 (한 해 + 해 사이 간격). FlatList의 getItemLayout에 쓴다.
// 마지막 해에도 간격을 붙여 모든 해의 길이를 같게 한다
export const YEAR_ITEM_LENGTH = YEAR_SECTION_HEIGHT + yearList.gap;

// # 함수 영역
// ## from~to의 연속한 해. 다룰 수 있는 연도 밖의 해는 뺀다
function createYears(from: number, to: number): number[] {
  const first = Math.max(from, MIN_YEAR);
  const last = Math.min(to, MAX_YEAR);

  return Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => first + index);
}

// ## 연도 목록 범위 (당겨오는 해 수는 utils/listWindow의 YEAR_WINDOW)
// ### 처음 목록: 기준 해의 앞뒤 YEAR_WINDOW.initialRange년
export function createYearWindow(baseYear: number): number[] {
  return createYears(baseYear - YEAR_WINDOW.initialRange, baseYear + YEAR_WINDOW.initialRange);
}

// ### 첫 해 바로 앞의 count년. 목록 앞에 붙일 해다
export function getYearsBefore(years: number[], count: number): number[] {
  return createYears(years[0] - count, years[0] - 1);
}

// ### 마지막 해 바로 뒤의 count년. 목록 뒤에 붙일 해다
export function getYearsAfter(years: number[], count: number): number[] {
  const last = years[years.length - 1];
  return createYears(last + 1, last + count);
}

// ### 목록 밖의 해까지 늘린 목록. 옮긴 뒤 바로 끝에 닿지 않게 그 해 너머로 YEAR_WINDOW.loadCount년을 더 붙인다
// 목록 안의 해면 같은 목록을 그대로 돌려준다
export function extendYearsToInclude(years: number[], year: number): number[] {
  const first = years[0];
  const last = years[years.length - 1];

  if (year < first) {
    return [...createYears(year - YEAR_WINDOW.loadCount, first - 1), ...years];
  }

  if (year > last) {
    return [...years, ...createYears(last + 1, year + YEAR_WINDOW.loadCount)];
  }

  return years;
}

// ## 해가 목록의 몇 번째인지. 목록 밖이면 -1
export function getYearIndex(years: number[], year: number): number {
  const index = year - years[0];
  return index >= 0 && index < years.length ? index : -1;
}

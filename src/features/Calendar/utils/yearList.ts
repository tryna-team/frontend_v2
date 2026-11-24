import { tempDesignValues } from '@/theme/tempDesignValues';
import { YEAR_SECTION_HEIGHT } from './yearGrid';

// # 상수 영역
// 화면을 연 해 기준으로 앞뒤에 둘 해 수. 월 목록(MONTH_RANGE)과 같은 앞뒤 5년이다
export const YEAR_RANGE = 5;
const { yearList } = tempDesignValues;

// 목록에서 한 해가 차지하는 길이 (한 해 + 해 사이 간격). FlatList의 getItemLayout에 쓴다.
// 마지막 해에도 간격을 붙여 모든 해의 길이를 같게 한다
export const YEAR_ITEM_LENGTH = YEAR_SECTION_HEIGHT + yearList.gap;

// # 함수 영역
// ## 연도 목록: 기준 날짜가 속한 해의 앞뒤 YEAR_RANGE년
export function getYearList(baseDate: string): number[] {
  const [baseYear] = baseDate.split('-').map(Number);

  return Array.from({ length: YEAR_RANGE * 2 + 1 }, (_, index) => baseYear - YEAR_RANGE + index);
}

// ## 해가 목록의 몇 번째인지. 목록 밖이면 -1
export function getYearIndex(years: number[], year: number): number {
  const index = year - years[0];
  return index >= 0 && index < years.length ? index : -1;
}

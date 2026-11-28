import { useState } from 'react';

import { MONTH_WINDOW } from '../utils/listWindow';
import {
  createMonthWindow,
  extendMonthsToInclude,
  getMonthsAfter,
  getMonthsBefore,
} from '../utils/monthList';

// # Main hook
// 월 목록에 담을 달(당겨온 범위). 화면을 열 때 기준 날짜(오늘) 주변만 만들고, 목록 끝에 가까워지면 앞뒤로 더 붙인다.
// 붙인 달은 버리지 않는다. 화면에 그리는 양은 FlatList가 보이는 곳 근처로 제한한다
export function useMonthWindow(baseDate: string) {
  // 시작 범위는 화면을 열 때 한 번만 정한다. 날짜가 바뀌었다고 다시 만들면 보던 위치가 밀린다
  const [months, setMonths] = useState(() => createMonthWindow(baseDate));

  return {
    months,
    // 목록 위쪽 끝에 가까워지면 부른다 (FlatList onStartReached)
    loadPrevious: () =>
      setMonths((current) => {
        const before = getMonthsBefore(current, MONTH_WINDOW.loadCount);
        return before.length > 0 ? [...before, ...current] : current;
      }),
    // 목록 아래쪽 끝에 가까워지면 부른다 (FlatList onEndReached)
    loadNext: () =>
      setMonths((current) => {
        const after = getMonthsAfter(current, MONTH_WINDOW.loadCount);
        return after.length > 0 ? [...current, ...after] : current;
      }),
    // 목록 밖의 달로 옮길 때 그 달까지 늘린다 ("오늘", 연간 화면에서 고른 달)
    includeMonth: (year: number, month: number) =>
      setMonths((current) => extendMonthsToInclude(current, year, month)),
  };
}

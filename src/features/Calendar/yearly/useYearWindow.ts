import { useState } from 'react';

import { YEAR_WINDOW } from '../utils/listWindow';
import {
  createYearWindow,
  extendYearsToInclude,
  getYearsAfter,
  getYearsBefore,
} from '../utils/yearList';

// # Main hook
// 연도 목록에 담을 해(당겨온 범위). 화면을 열 때 기준 해 주변만 만들고, 목록 끝에 가까워지면 앞뒤로 더 붙인다.
// 붙인 해는 버리지 않는다. 화면에 그리는 양은 FlatList가 보이는 곳 근처로 제한한다
export function useYearWindow(baseYear: number) {
  // 시작 범위는 화면을 열 때 한 번만 정한다
  const [years, setYears] = useState(() => createYearWindow(baseYear));

  return {
    years,
    // 목록 위쪽 끝에 가까워지면 부른다 (FlatList onStartReached)
    loadPrevious: () =>
      setYears((current) => {
        const before = getYearsBefore(current, YEAR_WINDOW.loadCount);
        return before.length > 0 ? [...before, ...current] : current;
      }),
    // 목록 아래쪽 끝에 가까워지면 부른다 (FlatList onEndReached)
    loadNext: () =>
      setYears((current) => {
        const after = getYearsAfter(current, YEAR_WINDOW.loadCount);
        return after.length > 0 ? [...current, ...after] : current;
      }),
    // 목록 밖의 해로 옮길 때 그 해까지 늘린다 ("오늘")
    includeYear: (year: number) => setYears((current) => extendYearsToInclude(current, year)),
  };
}

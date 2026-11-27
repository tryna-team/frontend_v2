import { useEffect, useEffectEvent, useImperativeHandle, useRef, useState } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';

import { tempDesignValues } from '@/theme/tempDesignValues';
import YearSection from './YearSection';
import { useYearWindow } from './useYearWindow';
import { useKeepPositionOnPrepend } from '../common/useKeepPositionOnPrepend';
import { KEEP_VISIBLE_POSITION, LOAD_THRESHOLD, isSupportedYear } from '../utils/listWindow';
import { YEAR_ITEM_LENGTH, getYearIndex } from '../utils/yearList';
import type { YearlyCalendarProps } from '../CalendarType';

// # 상수 영역
const { yearList } = tempDesignValues;
// 한 화면에 1~2년이 보이므로 처음에는 두 해를 그린다
const INITIAL_YEARS_TO_RENDER = 2;
// 한 해에 날짜 칸이 많아 스크롤 중에는 한 해씩 그리고, 보이는 영역 위아래로 한 화면씩만 미리 그려 둔다
const YEARS_PER_BATCH = 1;
const WINDOW_SIZE = 3;

// # 함수 영역
// ## 목록에서 해의 맨 위 위치. 모든 해의 길이가 같다
const getYearOffset = (index: number) => YEAR_ITEM_LENGTH * index;

// # Main component
// Figma Home/Yearly의 Calender Body 프레임. 해마다 YearSection을 세로로 이어 붙인 목록이다.
// 화면을 열 때 처음 보여 줄 해 주변만 담고, 목록 끝에 가까워지면 앞뒤로 해를 더 붙인다 (범위는 utils/listWindow).
// 모든 해의 높이가 같아 위치를 미리 계산하고(getItemLayout), 처음에는 그 해의 맨 위를 Header 바로 아래에 맞춘다.
// 본문 여백(MAIN_CONTENT_PADDING)이 0이라 스크롤 콘텐츠의 상단 여백은 Header 높이와 같다
export default function YearlyCalendar({
  mainArea,
  today,
  initialYear,
  onPressMonth,
  ref,
}: YearlyCalendarProps) {
  // 처음 맨 위에 보여 줄 해. 넘겨받은 해가 없거나 다룰 수 없는 해면 오늘이 속한 해다
  const [baseYear] = useState(() =>
    initialYear !== undefined && isSupportedYear(initialYear)
      ? initialYear
      : Number(today.slice(0, 4)),
  );
  // 목록에 담은 해. 처음 보여 줄 해 주변에서 시작해 목록 끝에 가까워지면 앞뒤로 늘어난다
  const { years, loadPrevious, loadNext, includeYear } = useYearWindow(baseYear);
  // 처음 위치는 한 번만 정한다
  const [initialIndex] = useState(() => getYearIndex(years, baseYear));
  // 목록 밖의 해로 옮기려고 목록을 늘렸을 때, 다시 그린 뒤 옮길 해
  const pendingYearRef = useRef<number | null>(null);
  const listRef = useRef<FlatList<number>>(null);

  // 웹은 앞에 해를 붙이면 보던 화면이 밀려서, 붙인 해의 높이만큼 직접 내린다
  useKeepPositionOnPrepend(listRef, years, String, getYearOffset);

  // 목록 안의 해로 옮긴다
  const scrollWithinList = (year: number) => {
    const index = getYearIndex(years, year);

    if (index >= 0) {
      listRef.current?.scrollToIndex({ index, animated: true });
    }
  };

  // 미뤄 둔 이동. 늘린 목록이 그려진 뒤에 부른다
  const runPendingScroll = useEffectEvent(() => {
    const year = pendingYearRef.current;

    if (year === null) return;

    pendingYearRef.current = null;
    scrollWithinList(year);
  });

  useEffect(() => {
    runPendingScroll();
  }, [years]);

  useImperativeHandle(ref, () => ({
    // 목록 안의 해면 바로 옮기고, 목록 밖이면 그 해까지 목록을 늘린 뒤 다시 그려지면 옮긴다
    scrollToYear: (year) => {
      if (getYearIndex(years, year) >= 0 || !isSupportedYear(year)) {
        scrollWithinList(year);
        return;
      }

      pendingYearRef.current = year;
      includeYear(year);
    },
  }));

  const getItemLayout = (_data: unknown, index: number) => ({
    length: YEAR_ITEM_LENGTH,
    offset: getYearOffset(index),
    index,
  });

  const renderItem = ({ item: year }: ListRenderItemInfo<number>) => (
    <View style={styles.item}>
      <YearSection year={year} today={today} onPressMonth={onPressMonth} />
    </View>
  );

  return (
    <FlatList
      ref={listRef}
      data={years}
      keyExtractor={(year) => String(year)}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialScrollIndex={initialIndex}
      initialNumToRender={INITIAL_YEARS_TO_RENDER}
      maxToRenderPerBatch={YEARS_PER_BATCH}
      windowSize={WINDOW_SIZE}
      // 목록 끝에 가까워지면 앞뒤로 해를 더 붙인다
      onStartReached={loadPrevious}
      onEndReached={loadNext}
      onStartReachedThreshold={LOAD_THRESHOLD}
      onEndReachedThreshold={LOAD_THRESHOLD}
      // 앞에 해를 붙여도 보던 해가 제자리에 있게 한다
      maintainVisibleContentPosition={KEEP_VISIBLE_POSITION}
      // Figma에 스크롤 막대가 없다
      showsVerticalScrollIndicator={false}
      {...mainArea.scrollProps}
    />
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  // 해 사이 간격 (Figma Calender Body의 간격)
  item: {
    paddingBottom: yearList.gap,
  },
});

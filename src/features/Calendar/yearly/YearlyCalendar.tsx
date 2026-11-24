import { useImperativeHandle, useRef, useState } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';

import { tempDesignValues } from '@/theme/tempDesignValues';
import YearSection from './YearSection';
import { YEAR_ITEM_LENGTH, YEAR_RANGE, getYearIndex, getYearList } from '../utils/yearList';
import type { YearlyCalendarProps } from '../CalendarType';

// # 상수 영역
const { yearList } = tempDesignValues;
// 한 화면에 1~2년이 보이므로 처음에는 두 해를 그린다
const INITIAL_YEARS_TO_RENDER = 2;
// 한 해에 날짜 칸이 많아 스크롤 중에는 한 해씩 그리고, 보이는 영역 위아래로 한 화면씩만 미리 그려 둔다
const YEARS_PER_BATCH = 1;
const WINDOW_SIZE = 3;

// # Main component
// Figma Home/Yearly의 Calender Body 프레임. 해마다 YearSection을 세로로 이어 붙인 목록이다.
// 모든 해의 높이가 같아 위치를 미리 계산하고(getItemLayout), 처음에는 initialYear의 맨 위를 Header 바로 아래에 맞춘다.
// 본문 여백(MAIN_CONTENT_PADDING)이 0이라 스크롤 콘텐츠의 상단 여백은 Header 높이와 같다
export default function YearlyCalendar({
  mainArea,
  today,
  initialYear,
  onPressMonth,
  ref,
}: YearlyCalendarProps) {
  // 범위는 화면을 열 때 한 번만 정한다. 날짜가 바뀌었다고 다시 만들면 보던 위치가 밀린다
  const [years] = useState(() => getYearList(today));
  // 처음 위치도 한 번만 정한다. 넘겨받은 해가 없거나 목록 밖이면 오늘이 속한 해(목록 가운데)다
  const [initialIndex] = useState(() => {
    const index = initialYear === undefined ? -1 : getYearIndex(years, initialYear);
    return index >= 0 ? index : YEAR_RANGE;
  });
  const listRef = useRef<FlatList<number>>(null);

  useImperativeHandle(ref, () => ({
    scrollToYear: (year) => {
      const index = getYearIndex(years, year);

      if (index >= 0) {
        listRef.current?.scrollToIndex({ index, animated: true });
      }
    },
  }));

  const getItemLayout = (_data: unknown, index: number) => ({
    length: YEAR_ITEM_LENGTH,
    offset: YEAR_ITEM_LENGTH * index,
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

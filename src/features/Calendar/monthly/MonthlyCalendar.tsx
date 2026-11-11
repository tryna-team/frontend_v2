import { useImperativeHandle, useRef, useState } from 'react';
import {
  FlatList,
  View,
  type LayoutChangeEvent,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { tempDesignValues } from '@/theme/tempDesignValues';
import CalendarBody from './CalendarBody';
import {
  MONTH_RANGE,
  getDateScrollOffset,
  getMonthList,
  getMonthListLayout,
  getMostVisibleMonthIndex,
} from '../utils/monthList';
import type { CalendarMonth, MonthlyCalendarProps } from '../CalendarType';

// # 상수 영역
const { monthList } = tempDesignValues;
// 한 화면에 1~2개월이 보이므로 처음과 스크롤 중에 두 달씩 그린다
const MONTHS_PER_RENDER = 2;
// 보이는 영역 위아래로 두 화면씩 미리 그려 둔다. 기본값(21)은 달 하나가 무거워 줄인다
const WINDOW_SIZE = 5;
// 스크롤 이벤트 간격(ms). 프레임마다 가장 많이 보이는 달을 다시 계산한다
const SCROLL_EVENT_THROTTLE = 16;

// # Main component
// Figma Home/Montly의 Calender Body 프레임. 달마다 Calendar Body를 세로로 이어 붙인 목록이다.
// 달 높이가 정해져 있어 위치를 미리 계산하고(getItemLayout), 그 값으로 원하는 달로 이동하거나 보이는 달을 구한다.
// 본문 여백(MAIN_CONTENT_PADDING)이 0이라 스크롤 콘텐츠의 상단 여백은 Header 높이(insets.top)와 같다
export default function MonthlyCalendar({
  mainArea,
  viewMode,
  today,
  selectedDate,
  eventDaysByMonth,
  onSelectDate,
  onVisibleMonthChange,
  ref,
}: MonthlyCalendarProps) {
  // 범위는 화면을 열 때 한 번만 정한다. 날짜가 바뀌었다고 다시 만들면 보던 위치가 밀린다
  const [months] = useState(() => getMonthList(today));
  // 가장 많이 보이는 달. 처음에는 오늘이 속한 달(목록 가운데)이다.
  // state는 보기 방식을 바꿔 목록을 다시 만들 때의 시작 위치로, ref는 스크롤 중 비교에 쓴다
  const [visibleIndex, setVisibleIndex] = useState(MONTH_RANGE);
  const visibleIndexRef = useRef(MONTH_RANGE);
  const listRef = useRef<FlatList<CalendarMonth>>(null);
  const listHeightRef = useRef(0);

  const { insets, scrollProps } = mainArea;
  const layout = getMonthListLayout(months, viewMode);
  const gapStyle = { paddingBottom: monthList.gap[viewMode] };

  useImperativeHandle(ref, () => ({
    scrollToDate: (date) => {
      // Header 아래 ~ Footer 위. 이 영역 안에 날짜의 주가 들어오게 한다
      const regionHeight = listHeightRef.current - insets.top - insets.bottom;
      const offset = getDateScrollOffset(months, layout, date, viewMode, regionHeight);

      if (offset !== null) {
        listRef.current?.scrollToOffset({ offset, animated: true });
      }
    },
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    listHeightRef.current = event.nativeEvent.layout.height;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    // 목록 좌표로 본 Header 아래 ~ Footer 위 영역
    const regionTop = contentOffset.y;
    const regionBottom = contentOffset.y + layoutMeasurement.height - insets.top - insets.bottom;
    const index = getMostVisibleMonthIndex(
      layout,
      regionTop,
      regionBottom,
      visibleIndexRef.current,
    );

    if (index === visibleIndexRef.current) return;

    visibleIndexRef.current = index;
    setVisibleIndex(index);
    onVisibleMonthChange?.(months[index].year, months[index].month);
  };

  const getItemLayout = (_data: unknown, index: number) => ({
    length: layout.lengths[index],
    offset: layout.offsets[index],
    index,
  });

  const renderItem = ({ item }: ListRenderItemInfo<CalendarMonth>) => {
    // TODO: API 연동 시 보이는 달 기준 앞뒤 M개월의 일정을 미리 불러온다 (v1은 앞뒤 1개월)
    //       아직 불러오지 않은 달로 빠르게 이동하면 그 달에 로딩 표시를 한다 (Figma 디자인 필요)
    const monthlyEventDays = eventDaysByMonth?.[item.key];
    // 선택 날짜는 그 날짜가 있는 달에만 넘긴다. 다른 달의 Calendar Body는 props가 그대로라 다시 그리지 않는다
    const monthSelectedDate = selectedDate?.startsWith(`${item.key}-`) ? selectedDate : undefined;

    return (
      <View style={gapStyle}>
        <CalendarBody
          year={item.year}
          month={item.month}
          viewMode={viewMode}
          monthlyEventDays={monthlyEventDays}
          today={today}
          selectedDate={monthSelectedDate}
          onSelectDate={onSelectDate}
        />
      </View>
    );
  };

  return (
    <FlatList
      // 보기 방식이 바뀌면 달 높이가 모두 바뀌므로 목록을 새로 만들고, 보던 달에서 다시 시작한다
      key={viewMode}
      ref={listRef}
      data={months}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialScrollIndex={visibleIndex}
      initialNumToRender={MONTHS_PER_RENDER}
      maxToRenderPerBatch={MONTHS_PER_RENDER}
      windowSize={WINDOW_SIZE}
      onLayout={handleLayout}
      onScroll={handleScroll}
      scrollEventThrottle={SCROLL_EVENT_THROTTLE}
      // Figma에 스크롤 막대가 없다
      showsVerticalScrollIndicator={false}
      {...scrollProps}
    />
  );
}

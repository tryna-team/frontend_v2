import { useEffect, useEffectEvent, useImperativeHandle, useRef, useState } from 'react';
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
import { useMonthWindow } from './useMonthWindow';
import { useKeepPositionOnPrepend } from '../common/useKeepPositionOnPrepend';
import { KEEP_VISIBLE_POSITION, LOAD_THRESHOLD } from '../utils/listWindow';
import {
  getDateScrollOffset,
  getMonthIndex,
  getMonthKeyIndex,
  getMonthListLayout,
  getMonthScrollOffset,
  getMostVisibleMonthIndex,
  isSupportedMonth,
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

// # 타입 영역
// 스크롤할 곳. 목록 밖의 달이면 목록을 늘리고, 다시 그린 뒤 옮긴다
type ScrollRequest =
  | { type: 'date'; date: string } // scrollToDate ("오늘" 버튼)
  | { type: 'month'; year: number; month: number }; // scrollToMonth (연간 화면에서 고른 달)

// # Main component
// Figma Home/Montly의 Calender Body 프레임. 달마다 Calendar Body를 세로로 이어 붙인 목록이다.
// 화면을 열 때 오늘 주변 달만 담고, 목록 끝에 가까워지면 앞뒤로 달을 더 붙인다 (범위는 utils/listWindow).
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
  // 목록에 담은 달. 오늘 주변에서 시작해 목록 끝에 가까워지면 앞뒤로 늘어난다
  const { months, loadPrevious, loadNext, includeMonth } = useMonthWindow(today);
  // 가장 많이 보이는 달('YYYY-MM'). 처음에는 오늘이 속한 달이다.
  // 앞에 달이 붙으면 같은 달의 인덱스가 밀리므로 인덱스가 아니라 키로 기억한다.
  // state는 보기 방식을 바꿔 목록을 다시 만들 때의 시작 위치로, ref는 스크롤 중 비교에 쓴다
  const [visibleMonthKey, setVisibleMonthKey] = useState(() => today.slice(0, 7));
  const visibleMonthKeyRef = useRef(visibleMonthKey);
  // 목록 밖의 달로 옮기려고 목록을 늘렸을 때, 다시 그린 뒤 옮길 곳
  const pendingScrollRef = useRef<ScrollRequest | null>(null);
  const listRef = useRef<FlatList<CalendarMonth>>(null);
  const listHeightRef = useRef(0);

  const { insets, scrollProps } = mainArea;
  const layout = getMonthListLayout(months, viewMode);
  const gapStyle = { paddingBottom: monthList.gap[viewMode] };

  // 웹은 앞에 달을 붙이면 보던 화면이 밀려서, 붙인 달의 높이만큼 직접 내린다
  useKeepPositionOnPrepend(
    listRef,
    months,
    (item) => item.key,
    (index) => layout.offsets[index],
  );

  // Header 아래 ~ Footer 위 영역의 높이
  const getRegionHeight = () => listHeightRef.current - insets.top - insets.bottom;

  // 목록 좌표로 본 보이는 영역 [위, 아래]에서 가장 많이 보이는 달을 다시 구하고, 바뀌었으면 알린다
  const updateVisibleMonth = (regionTop: number, regionBottom: number) => {
    const currentIndex = Math.max(0, getMonthKeyIndex(months, visibleMonthKeyRef.current));
    const index = getMostVisibleMonthIndex(layout, regionTop, regionBottom, currentIndex);
    const { key, year, month } = months[index];

    if (key === visibleMonthKeyRef.current) return;

    visibleMonthKeyRef.current = key;
    setVisibleMonthKey(key);
    onVisibleMonthChange?.(year, month);
  };

  // 목록 안의 달로 옮긴다
  const scrollWithinList = (request: ScrollRequest) => {
    const regionHeight = getRegionHeight();

    // "오늘" 버튼. 이 영역 안에 날짜의 주가 들어오게 한다
    if (request.type === 'date') {
      const offset = getDateScrollOffset(months, layout, request.date, viewMode, regionHeight);

      if (offset !== null) {
        listRef.current?.scrollToOffset({ offset, animated: true });
      }
      return;
    }

    // 연간 화면에서 돌아오는 동안 옮기므로 애니메이션 없이 바로 옮기고,
    // 스크롤 이벤트를 기다리지 않고 헤더의 월 제목과 Toolbar의 연도도 바로 맞춘다
    const offset = getMonthScrollOffset(months, layout, request.year, request.month, regionHeight);

    listRef.current?.scrollToOffset({ offset, animated: false });
    updateVisibleMonth(offset, offset + regionHeight);
  };

  // 목록 안의 달이면 바로 옮기고, 목록 밖이면 그 달까지 목록을 늘린 뒤 다시 그려지면 옮긴다
  const requestScroll = (request: ScrollRequest, year: number, month: number) => {
    if (getMonthIndex(months, year, month) >= 0 || !isSupportedMonth(year, month)) {
      scrollWithinList(request);
      return;
    }

    pendingScrollRef.current = request;
    includeMonth(year, month);
  };

  // 미뤄 둔 이동. 늘린 목록이 그려진 뒤에 부른다
  const runPendingScroll = useEffectEvent(() => {
    const request = pendingScrollRef.current;

    if (!request) return;

    pendingScrollRef.current = null;
    scrollWithinList(request);
  });

  useEffect(() => {
    runPendingScroll();
  }, [months]);

  useImperativeHandle(ref, () => ({
    scrollToDate: (date) => {
      const [year, month] = date.split('-').map(Number);
      requestScroll({ type: 'date', date }, year, month);
    },
    scrollToMonth: (year, month) => {
      requestScroll({ type: 'month', year, month }, year, month);
    },
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    listHeightRef.current = event.nativeEvent.layout.height;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const regionTop = contentOffset.y;
    const regionBottom = contentOffset.y + layoutMeasurement.height - insets.top - insets.bottom;

    updateVisibleMonth(regionTop, regionBottom);
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
      initialScrollIndex={Math.max(0, getMonthKeyIndex(months, visibleMonthKey))}
      initialNumToRender={MONTHS_PER_RENDER}
      maxToRenderPerBatch={MONTHS_PER_RENDER}
      windowSize={WINDOW_SIZE}
      // 목록 끝에 가까워지면 앞뒤로 달을 더 붙인다
      onStartReached={loadPrevious}
      onEndReached={loadNext}
      onStartReachedThreshold={LOAD_THRESHOLD}
      onEndReachedThreshold={LOAD_THRESHOLD}
      // 앞에 달을 붙여도 보던 달이 제자리에 있게 한다
      maintainVisibleContentPosition={KEEP_VISIBLE_POSITION}
      onLayout={handleLayout}
      onScroll={handleScroll}
      scrollEventThrottle={SCROLL_EVENT_THROTTLE}
      // Figma에 스크롤 막대가 없다
      showsVerticalScrollIndicator={false}
      {...scrollProps}
    />
  );
}

import { useRef, useState } from 'react';

import { useCalendarStore, useSettingsStore } from '@/stores';
import type { MonthlyCalendarHandle, MonthlyViewMode } from './CalendarType';

// # 타입 영역
// 화면에서 가장 많이 보이는 달. 헤더의 월 제목과 Toolbar의 연도에 쓴다
type VisibleMonth = {
  year: number;
  month: number; // 1~12
};

// # Main hook
// 캘린더 화면(HomeScreen)이 쓰는 상태와 동작을 모은다. 화면은 이 훅이 돌려주는 값만 쓴다.
// 여러 화면이 함께 쓰는 값은 store에서 읽고, 이 화면에서만 쓰는 값은 화면 안의 state로 둔다
export function useCalendarPageState() {
  // 오늘. 자정이 지나거나 앱으로 돌아올 때 useTodaySync가 갱신한다
  const today = useCalendarStore((state) => state.today);
  // 연·월·주 화면이 함께 쓰는 선택 날짜
  const selectedDate = useCalendarStore((state) => state.selectedDate);
  const selectDate = useCalendarStore((state) => state.selectDate);
  // store의 goToToday는 값만 바꾼다. 오늘이 있는 달로 스크롤하는 건 아래 goToToday가 맡는다
  const goToTodayInStore = useCalendarStore((state) => state.goToToday);
  // 앱을 다시 켜도 유지되는 설정. 앱 시작 준비(useAppReady)에서 복원한 뒤에 화면을 그린다
  const viewMode = useSettingsStore((state) => state.monthlyViewMode);
  const setMonthlyViewMode = useSettingsStore((state) => state.setMonthlyViewMode);

  // 아래는 이 화면에서만 쓰는 상태라 화면 안에 둔다
  const [visibleMonth, setVisibleMonth] = useState<VisibleMonth>(() => {
    const [year, month] = today.split('-').map(Number);
    return { year, month };
  });
  const [isViewModeMenuOpen, setIsViewModeMenuOpen] = useState(false);
  const monthListRef = useRef<MonthlyCalendarHandle>(null);

  return {
    today,
    selectedDate,
    viewMode,
    visibleMonth,
    isViewModeMenuOpen,
    monthListRef,
    selectDate,
    changeVisibleMonth: (year: number, month: number) => setVisibleMonth({ year, month }),
    // 보기 방식 메뉴. 항목을 고르면 보기 방식을 바꾸고 메뉴는 ViewModeMenu가 닫는다
    openViewModeMenu: () => setIsViewModeMenuOpen(true),
    closeViewModeMenu: () => setIsViewModeMenuOpen(false),
    changeViewMode: (mode: MonthlyViewMode) => setMonthlyViewMode(mode),
    // "오늘" 버튼. 선택 날짜를 오늘로 바꾸고, store가 방금 맞춘 오늘이 있는 달로 스크롤한다
    goToToday: () => {
      goToTodayInStore();
      monthListRef.current?.scrollToDate(useCalendarStore.getState().today);
    },
  };
}

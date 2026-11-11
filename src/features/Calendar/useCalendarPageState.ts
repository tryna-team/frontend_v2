import { useRef, useState } from 'react';

import { getTodayKey } from '@/utils/date';
import type { MonthlyCalendarHandle, MonthlyViewMode } from './CalendarType';

// # 타입 영역
// 화면에서 가장 많이 보이는 달. 헤더의 월 제목과 Toolbar의 연도에 쓴다
type VisibleMonth = {
  year: number;
  month: number; // 1~12
};

// # Main hook
// 캘린더 화면(HomeScreen)이 쓰는 상태와 동작을 모은다. 화면은 이 훅이 돌려주는 값만 쓴다.
// 지금은 화면 안의 state로 채우고, 상태를 연결할 때는 이 파일만 고친다
export function useCalendarPageState() {
  // TODO: 상태 연결 시 calendarStore의 today로 교체 (자정·앱 복귀 때 갱신된다). 지금은 화면을 열 때의 날짜로 고정
  const [today] = useState(getTodayKey);
  // TODO: 상태 연결 시 calendarStore의 selectedDate·selectDate로 교체
  const [selectedDate, setSelectedDate] = useState(today);
  // TODO: 상태 연결 시 settingsStore의 monthlyViewMode로 교체 (앱을 다시 켜도 유지된다).
  //       보기 방식 메뉴(ViewModeMenu)를 연결할 때 변경 함수(setMonthlyViewMode)도 함께 돌려준다
  const [viewMode] = useState<MonthlyViewMode>('summary');

  // 아래는 이 화면에서만 쓰는 상태라 상태를 연결한 뒤에도 그대로 둔다
  const [visibleMonth, setVisibleMonth] = useState<VisibleMonth>(() => {
    const [year, month] = today.split('-').map(Number);
    return { year, month };
  });
  const monthListRef = useRef<MonthlyCalendarHandle>(null);

  return {
    today,
    selectedDate,
    viewMode,
    visibleMonth,
    monthListRef,
    selectDate: (date: string) => setSelectedDate(date),
    changeVisibleMonth: (year: number, month: number) => setVisibleMonth({ year, month }),
    // "오늘" 버튼. calendarStore의 goToToday처럼 선택 날짜를 오늘로 바꾸고, 오늘이 있는 달로 스크롤한다
    goToToday: () => {
      setSelectedDate(today);
      monthListRef.current?.scrollToDate(today);
    },
  };
}

import { create } from 'zustand';

import { getTodayKey } from '@/utils/date';

// 연/월/주 화면이 함께 쓰는 날짜 상태만 둔다.
// 일정 데이터는 서버 캐시(React Query)로, 화면마다 다른 값(Daily 날짜 등)은 라우트 파라미터로 관리한다.
// 스크롤 위치와 화면에 보이는 월 목록은 스크롤할 때마다 바뀌므로 각 화면의 로컬 상태(ref)로 둔다.

// 추가 예정: viewMonth/setViewMonth는 월간 뒤로가기 라벨 정책이 정해지면 추가

interface CalendarState {
  /** 연/월/주 화면이 함께 쓰는 선택 날짜 'YYYY-MM-DD' */
  selectedDate: string;
  /** 오늘 'YYYY-MM-DD'. 앱이 다시 활성화되거나 자정이 지나면 refreshToday()로 갱신한다 */
  today: string;

  selectDate: (date: string) => void;
  /** "오늘" 버튼. 값만 바꾸고, 오늘 위치로 스크롤하는 건 화면이 맡는다 */
  goToToday: () => void;
  /** today만 갱신한다. 선택 날짜는 사용자가 고른 값이므로 그대로 둔다 */
  refreshToday: () => void;
}

export const useCalendarStore = create<CalendarState>()((set) => {
  // 액션에서는 이 값을 재사용하지 않고 호출 시점의 오늘을 다시 계산한다
  const today = getTodayKey();

  return {
    selectedDate: today,
    today,

    selectDate: (date) => set({ selectedDate: date }),
    goToToday: () => {
      const now = getTodayKey();
      set({ selectedDate: now, today: now });
    },
    refreshToday: () => set({ today: getTodayKey() }),
  };
});

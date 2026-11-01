import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useCalendarStore } from '@/stores';
import { getMsUntilNextMidnight } from '@/utils/date';

/**
 * calendarStore의 today를 실제 오늘과 맞춘다. 루트 레이아웃에서 한 번만 호출한다.
 * - 앱을 켜 둔 채 자정을 넘기는 경우: 다음 자정에 맞춘 타이머
 * - 백그라운드에 있다가 돌아오는 경우: AppState가 active가 될 때 (iOS는 백그라운드에서 JS 타이머가 멈춘다)
 */
export function useTodaySync() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const sync = () => {
      useCalendarStore.getState().refreshToday();
      // 남은 시간을 매번 다시 계산하므로, 백그라운드에 오래 있었거나 시계가 바뀌어도 다음 예약에서 맞춰진다
      clearTimeout(timer);
      timer = setTimeout(sync, getMsUntilNextMidnight());
    };

    sync();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        sync();
      }
    });

    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, []);
}

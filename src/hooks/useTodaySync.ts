import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useCalendarStore } from '@/stores';
import { getMsUntilNextMidnight } from '@/utils/date';

// 앱이 앞에 떠 있는 동안 today를 다시 확인하는 최대 간격.
// Android의 JS 타이머는 기기 시계가 아니라 흐른 시간 기준으로 발화해서, 실행 중 시계가 앞으로 바뀌면(자동 보정, 시간대 변경)
// 자정 타이머가 늦게 울린다. 다음 자정보다 이 간격이 짧으면 먼저 확인해, 그런 경우에도 늦어도 1시간 안에 맞춘다.
// 확인 예정: 시간대가 바뀌면 JS 엔진(Hermes)이 앱을 다시 켤 때까지 예전 시간대를 쓴다는 보고가 있어, 해외 이동 시 동작은 개발 빌드에서 확인
const MAX_RECHECK_MS = 60 * 60 * 1000;

/**
 * calendarStore의 today를 실제 오늘과 맞춘다. 루트 레이아웃에서 한 번만 호출한다.
 * - 앱을 켜 둔 채 자정을 넘기는 경우: 다음 자정에 맞춘 타이머 (최대 1시간 간격으로 다시 확인)
 * - 백그라운드에 있다가 돌아오는 경우: AppState가 active가 될 때 (iOS는 백그라운드에서 JS 타이머가 멈춘다)
 */
export function useTodaySync() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const sync = () => {
      useCalendarStore.getState().refreshToday();
      // 남은 시간을 매번 다시 계산하므로, 백그라운드에 오래 있었거나 시계가 바뀌어도 다음 예약에서 맞춰진다
      clearTimeout(timer);
      timer = setTimeout(sync, Math.min(getMsUntilNextMidnight(), MAX_RECHECK_MS));
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

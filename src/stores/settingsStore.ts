import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { KV_KEYS, persistStorage } from '@/lib/storage';

// 앱을 다시 켜도 유지되어야 하는 사용자 설정. 설정 시트, 월간 메뉴 등 여러 화면에서 함께 읽고 쓴다.
// 설정을 추가할 때는 Settings 타입, DEFAULT_SETTINGS, setter 세 곳만 고치면 저장까지 된다.

interface NotificationSettings {
  allEnabled: boolean; // 설정 화면의 "알림" 토글
  eventReminderEnabled: boolean; // F101 일정 전 리마인드
  timedActionReminderEnabled: boolean; // F102 시간형 실행 항목 리마인드
  defaultReminderMinutesBefore: number; // 기본 알림 시간 (분)
}

/** 월간 캘린더 표시 방식. 기본값은 DEFAULT_SETTINGS에서 정한다 */
export type MonthlyViewMode = 'summary' | 'detail';

interface Settings {
  notification: NotificationSettings;
  /** G105 요청·응답 필드명 그대로. 서버 값이 기준이라 응답을 받으면 덮어쓴다 */
  isFeedbackDataCollected: boolean;
  monthlyViewMode: MonthlyViewMode;
}

interface SettingsState extends Settings {
  setNotificationSetting: <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K],
  ) => void;
  setIsFeedbackDataCollected: (value: boolean) => void;
  setMonthlyViewMode: (mode: MonthlyViewMode) => void;
}

/** 기본값은 여기서만 정한다. 이미 설정이 저장된 기기에는 바뀐 기본값이 반영되지 않는다 */
const DEFAULT_SETTINGS: Settings = {
  notification: {
    allEnabled: true,
    eventReminderEnabled: true,
    timedActionReminderEnabled: true,
    defaultReminderMinutesBefore: 30,
  },
  isFeedbackDataCollected: true,
  monthlyViewMode: 'summary',
};

const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[];

/** DEFAULT_SETTINGS에 있는 키만 저장한다. 액션이나 삭제된 옛 항목은 저장되지 않는다 */
function pickSettings(state: Settings): Settings {
  return Object.fromEntries(SETTINGS_KEYS.map((key) => [key, state[key]])) as unknown as Settings;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setNotificationSetting: (key, value) =>
        set((state) => ({ notification: { ...state.notification, [key]: value } })),
      setIsFeedbackDataCollected: (value) => set({ isFeedbackDataCollected: value }),
      setMonthlyViewMode: (mode) => set({ monthlyViewMode: mode }),
    }),
    {
      name: KV_KEYS.settings,
      storage: createJSONStorage(() => persistStorage),
      // 저장 구조를 바꿀 때 version을 올리고 migrate를 추가한다. migrate 없이 올리면 저장된 설정이 버려진다
      version: 1,
      partialize: (state) => pickSettings(state),
      // 기본 merge는 최상위 키만 덮어써서, notification에 항목을 추가하면 저장된 옛 객체가 기본값을 통째로 덮는다.
      // notification은 안쪽까지 합쳐 새 항목에 기본값이 들어가게 한다.
      merge: (persistedState, currentState) => {
        const saved = (persistedState ?? {}) as Partial<Settings>;

        return {
          ...currentState,
          ...saved,
          notification: { ...currentState.notification, ...saved.notification },
        };
      },
    },
  ),
);

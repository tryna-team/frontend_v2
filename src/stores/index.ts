// 스토어는 이 파일을 통해서 사용한다: import { useAuthStore } from '@/stores';
// 파일명은 {domain}Store.ts, export하는 훅은 use{Domain}Store 규칙을 따른다.
// store끼리는 서로 import하지 않는다. 여러 store를 함께 다루는 흐름은 서비스·훅에 둔다.
// 구독은 필드 하나씩 selector로 한다: useCalendarStore((state) => state.selectedDate)
// 여러 값을 객체로 고를 때는 useShallow(zustand/react/shallow)로 묶는다. 묶지 않으면 매번 새 객체라 무한 렌더링 오류가 난다.
// React 밖에서는 getState()로 읽는다: useAuthStore.getState(), getAuthState()

// 추가 예정: 일정 생성 store는 생성 시트를 만들 때 시트 스코프(createStore + Context)로 만든다. 전역 store가 아니므로 여기에 넣지 않는다
export * from './authStore';
export * from './calendarStore';
export * from './settingsStore';
export * from './uiStore';

// 스토어는 이 파일을 통해서 사용한다: import { useAuthStore } from '@/stores';
// 파일명은 {domain}Store.ts, export하는 훅은 use{Domain}Store 규칙을 따른다.
// store끼리는 서로 import하지 않는다. 여러 store를 함께 다루는 흐름은 서비스·훅에 둔다.
// 구독은 필드 하나씩 selector로 하고, 여러 값은 useShallow로 묶는다. React 밖에서는 getState()로 읽는다.
export * from './authStore';
export * from './calendarStore';
export * from './settingsStore';
export * from './uiStore';

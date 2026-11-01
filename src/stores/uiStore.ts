import { create } from 'zustand';

// 앱 어디서든(훅, API 인터셉터) 이벤트로 띄우는 시트와 토스트만 둔다.
// 화면 하나에 속한 시트·모달(일정 생성 시트, 폐기 확인 모달 등)은 그 화면의 로컬 상태로 관리한다.
// 시트·토스트를 그리는 컴포넌트는 루트에 하나만 배치한다.

// 추가 예정: 로그인·알림 권한 시트는 시트 구현 방식이 정해지면 추가

/** 시트 종류와 그 시트에 필요한 데이터를 함께 담는다 */
export type GlobalSheet =
  | {
      type: 'loginRequired'; // A104
      actionType: string;
      guideMessage: string; // 서버가 내려준 문구를 그대로 쓴다
    }
  | { type: 'networkError' };

export type ToastType = 'loginFailed' | 'eventLoadFailed';

interface UIState {
  /** 한 번에 하나만 띄운다. 열려 있을 때 다른 시트를 열면 새 시트로 바뀐다 */
  activeSheet: GlobalSheet | null;
  toast: ToastType | null;

  openSheet: (sheet: GlobalSheet) => void;
  closeSheet: () => void;
  showToast: (toast: ToastType) => void;
  clearToast: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  activeSheet: null,
  toast: null,

  openSheet: (sheet) => set({ activeSheet: sheet }),
  closeSheet: () => set({ activeSheet: null }),
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),
}));

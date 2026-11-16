import { createContext, useContext, type ComponentRef, type RefObject } from 'react';
import type { View } from 'react-native';
import type { BlurMethod } from 'expo-blur';

// Android 블러 대상 공유
// Android의 BlurView는 BlurTargetView로 감싼 영역만 블러할 수 있다.
// Layout이 Main을 BlurTargetView로 감싸고 그 ref를 내려주면, Header·Footer 안의 BlurView가 함께 쓴다.
// (iOS·웹에서는 blurTarget·blurMethod가 무시된다)

// 블러 대상 ref에 담기는 값: 화면에 그려진 View 인스턴스 (expo-blur의 blurTarget과 같은 표기)
// ⚠️ 타입 자리의 View는 인스턴스가 아니라 View 컴포넌트 함수 자체라서 RefObject<View>로 쓰면 타입 에러가 난다
export type BlurTargetInstance = ComponentRef<typeof View>;

export const BlurTargetContext = createContext<RefObject<BlurTargetInstance | null> | null>(null);

type BlurTargetProps = {
  blurTarget?: RefObject<BlurTargetInstance | null>;
  blurMethod: BlurMethod;
};

// BlurView에 그대로 펼쳐 넣는 값. 대상이 없으면(Main 안 등) 반투명으로 대체한다.
// Android 12(SDK 31) 미만은 성능 문제로 expo-blur가 자동으로 반투명으로 대체한다.
export function useBlurTarget(): BlurTargetProps {
  const blurTarget = useContext(BlurTargetContext);

  if (!blurTarget) return { blurMethod: 'none' };
  return { blurTarget, blurMethod: 'dimezisBlurViewSdk31Plus' };
}

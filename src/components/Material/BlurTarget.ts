import { createContext, useContext, type RefObject } from 'react';
import type { View } from 'react-native';
import type { BlurMethod } from 'expo-blur';

// Android 블러 대상 공유
// Android의 BlurView는 BlurTargetView로 감싼 영역만 블러할 수 있다.
// Layout이 Main을 BlurTargetView로 감싸고 그 ref를 내려주면, Header·Footer 안의 BlurView가 함께 쓴다.
// (iOS·웹에서는 blurTarget·blurMethod가 무시된다)
export const BlurTargetContext = createContext<RefObject<View | null> | null>(null);

type BlurTargetProps = {
  blurTarget?: RefObject<View | null>;
  blurMethod: BlurMethod;
};

// BlurView에 그대로 펼쳐 넣는 값. 대상이 없으면(Main 안 등) 반투명으로 대체한다.
// Android 12(SDK 31) 미만은 성능 문제로 expo-blur가 자동으로 반투명으로 대체한다.
export function useBlurTarget(): BlurTargetProps {
  const blurTarget = useContext(BlurTargetContext);

  if (!blurTarget) return { blurMethod: 'none' };
  return { blurTarget, blurMethod: 'dimezisBlurViewSdk31Plus' };
}

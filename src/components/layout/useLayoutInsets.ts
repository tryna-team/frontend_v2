import { useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FOOTER_CONTENT_HEIGHT, TOOLBAR_HEIGHT } from './constants';
import type { ScreenInsets } from './types';

type UseLayoutInsetsParams = {
  hasHeader: boolean;
  hasFooter: boolean;
};

// 레이아웃 수치 계산을 한 곳에 모은다.
// safe area를 읽는 곳은 앱 전체에서 이 훅 하나뿐이다.
export function useLayoutInsets({ hasHeader, hasFooter }: UseLayoutInsetsParams) {
  const safeArea = useSafeAreaInsets();

  // headerAccessory 유무에 따라 Header 높이가 달라지므로 실제 높이를 측정한다.
  // 측정 전 첫 프레임에는 상태바 + Toolbar 높이를 추정값으로 사용한다.
  const [measuredHeaderHeight, setMeasuredHeaderHeight] = useState<number | null>(null);

  const footerHeight = FOOTER_CONTENT_HEIGHT + safeArea.bottom;

  const insets: ScreenInsets = {
    top: hasHeader ? (measuredHeaderHeight ?? safeArea.top + TOOLBAR_HEIGHT) : safeArea.top,
    bottom: hasFooter ? footerHeight : safeArea.bottom,
  };

  const handleHeaderLayout = (event: LayoutChangeEvent) => {
    setMeasuredHeaderHeight(event.nativeEvent.layout.height);
  };

  return {
    insets,
    safeAreaTop: safeArea.top,
    safeAreaBottom: safeArea.bottom,
    footerHeight,
    onHeaderLayout: handleHeaderLayout,
  };
}

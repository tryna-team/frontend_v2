import type { ViewStyle } from 'react-native';

import { MAIN_CONTENT_PADDING } from './constants';
import type { MainArea, ScreenInsets } from './types';

// 메인 영역 콘텐츠 여백을 한 곳에서 계산한다.
// 여백은 Main 컨테이너가 아니라 스크롤 "콘텐츠"에 적용한다.
// Main 컨테이너에 주면 스크롤 영역 자체가 줄어들어 콘텐츠가 Header·Footer 뒤로 지나가지 못한다.
export function getMainArea(insets: ScreenInsets): MainArea {
  const contentStyle: ViewStyle = {
    paddingTop: insets.top + MAIN_CONTENT_PADDING.top,
    paddingBottom: insets.bottom + MAIN_CONTENT_PADDING.bottom,
    paddingLeft: MAIN_CONTENT_PADDING.left,
    paddingRight: MAIN_CONTENT_PADDING.right,
  };

  return {
    insets,
    contentStyle,
    scrollProps: {
      contentContainerStyle: contentStyle,
    },
  };
}

import type { ViewStyle } from 'react-native';

export type ScreenInsets = {
  /** 스크롤 콘텐츠 상단 여백 (상태바 + Header 오버레이) */
  top: number;
  /** 스크롤 콘텐츠 하단 여백 (Footer 오버레이, Footer가 없으면 홈 인디케이터 영역) */
  bottom: number;
};

// Layout이 화면(children)에 넘겨주는 메인 영역 정보
export type MainArea = {
  /** Header·Footer 오버레이가 덮는 높이. 스크롤 위치 계산처럼 숫자가 직접 필요할 때만 사용한다 */
  insets: ScreenInsets;
  /** 메인 콘텐츠 여백 (오버레이 높이 + 메인 여백). 스크롤이 없는 화면은 콘텐츠 View의 style에 적용한다 */
  contentStyle: ViewStyle;
  /** ScrollView·FlatList에 그대로 펼쳐 넣는 props. 예: <ScrollView {...main.scrollProps}> */
  scrollProps: {
    contentContainerStyle: ViewStyle;
  };
};

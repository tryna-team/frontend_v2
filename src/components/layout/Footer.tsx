import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type FooterProps = {
  /** Footer 전체 높이 (콘텐츠 + 홈 인디케이터 영역) */
  height: number;
  /** 홈 인디케이터 영역 높이. 이만큼 아래를 비우고 콘텐츠를 배치한다 */
  safeAreaBottom: number;
  children: ReactNode;
};

// Footer 오버레이: 콘텐츠 위에 떠 있고, 빈 공간의 터치는 아래 Main으로 통과시킨다.
export function Footer({ height, safeAreaBottom, children }: FooterProps) {
  return (
    <View style={[styles.container, { height, paddingBottom: safeAreaBottom }]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    // Figma 기준 Footer 배경은 투명하므로 배경색을 지정하지 않는다
    pointerEvents: 'box-none',
  },
});

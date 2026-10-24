import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { palette } from '@theme/colors';

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
    <View style={[styles.container, { height, paddingBottom: safeAreaBottom }]}>
      {/* Figma Footer 배경: 위 투명 → 아래 흰색 그라데이션 (홈 인디케이터 영역까지) */}
      <View style={styles.background}>
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="footerBackground" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={palette.white} stopOpacity={0} />
              <Stop offset="1" stopColor={palette.white} stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#footerBackground)" />
        </Svg>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  // 그라데이션 레이어. 터치는 받지 않는다
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
});

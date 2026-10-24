import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@theme/colors';

import { Footer } from './Footer';
import { Header } from './Header';
import { getMainArea } from './mainArea';
import type { MainArea } from './types';
import { useLayoutInsets } from './useLayoutInsets';

type LayoutProps = {
  /** 상단 Toolbar 영역. 없으면 Header 오버레이를 렌더링하지 않는다 */
  toolbar?: ReactNode;
  /** Toolbar 아래에서 Header 배경을 함께 쓰는 고정 영역 (예: 캘린더 월 타이틀 + 요일 줄) */
  headerAccessory?: ReactNode;
  /** 하단 Footer 영역. 없으면 Footer 오버레이를 렌더링하지 않는다 */
  footer?: ReactNode;
  /**
   * Main 영역. 넘겨받은 main의 여백을 스크롤 콘텐츠에 적용한다.
   * 예: {(main) => <ScrollView {...main.scrollProps}>…</ScrollView>}
   */
  children: (main: MainArea) => ReactNode;
};

// 화면을 Main + Header 오버레이 + Footer 오버레이로 조립한다.
// 수치 계산은 useLayoutInsets, 메인 영역 여백은 getMainArea, 각 영역의 모양은 Header/Footer가 담당한다.
export function Layout({ toolbar, headerAccessory, footer, children }: LayoutProps) {
  const hasHeader = toolbar !== undefined;
  const hasFooter = footer !== undefined;
  const { insets, safeAreaTop, safeAreaBottom, footerHeight, onHeaderLayout } = useLayoutInsets({
    hasHeader,
    hasFooter,
  });

  return (
    <View style={styles.root}>
      {/* Main: 오버레이보다 먼저 그려서 Header/Footer 아래에 깔리도록 한다 */}
      <View style={styles.main}>{children(getMainArea(insets))}</View>

      {hasHeader && (
        <Header
          safeAreaTop={safeAreaTop}
          toolbar={toolbar}
          accessory={headerAccessory}
          onLayout={onHeaderLayout}
        />
      )}

      {hasFooter && (
        <Footer height={footerHeight} safeAreaBottom={safeAreaBottom}>
          {footer}
        </Footer>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  main: {
    flex: 1,
  },
});

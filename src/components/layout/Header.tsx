import type { ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { TOOLBAR_HEIGHT } from './constants';

type HeaderProps = {
  /** 상태바 영역 높이. 이만큼 위를 비우고 Toolbar를 배치한다 */
  safeAreaTop: number;
  toolbar: ReactNode;
  accessory?: ReactNode;
  onLayout: (event: LayoutChangeEvent) => void;
};

// Header 오버레이: 상태바 영역 + Toolbar + accessory를 배경 한 장으로 덮는다.
export function Header({ safeAreaTop, toolbar, accessory, onLayout }: HeaderProps) {
  return (
    <View style={[styles.container, { paddingTop: safeAreaTop }]} onLayout={onLayout}>
      <View style={styles.toolbar}>{toolbar}</View>
      {accessory}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // TODO: Header 배경(반투명 + 블러)은 디자인 디테일 작업 시 추가
  },
  toolbar: {
    minHeight: TOOLBAR_HEIGHT,
  },
});

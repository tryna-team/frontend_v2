import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { useBlurTarget } from '@/components/Material/BlurTarget';
import { colors, palette } from '@theme/colors';

import { TOOLBAR_HEIGHT } from './constants';

// 블러 색조. expo-blur는 모든 tint에 자체 색을 덧칠하므로 가장 옅은 값을 고른다.
// iOS: 가장 옅은 라이트 머티리얼 / 웹: 덧칠 색이 가장 옅은 'default' (흰색 30%)
const BLUR_TINT = Platform.OS === 'web' ? 'default' : 'systemUltraThinMaterialLight';

type HeaderProps = {
  /** 상태바 영역 높이. 이만큼 위를 비우고 Toolbar를 배치한다 */
  safeAreaTop: number;
  toolbar: ReactNode;
  accessory?: ReactNode;
  onLayout: (event: LayoutChangeEvent) => void;
};

// Header 오버레이: 상태바 영역 + Toolbar + accessory를 배경 한 장으로 덮는다.
export function Header({ safeAreaTop, toolbar, accessory, onLayout }: HeaderProps) {
  const blurTargetProps = useBlurTarget();

  return (
    <View style={[styles.container, { paddingTop: safeAreaTop }]} onLayout={onLayout}>
      {/* Figma Calender Header 배경: 배경 블러 + 흰색 40% (상태바 영역까지 덮음) */}
      {/* TODO: Android 블러 세기를 실기기에서 iOS와 비교해 blurReductionFactor로 맞추기 */}
      <BlurView intensity={100} tint={BLUR_TINT} style={styles.background} {...blurTargetProps}>
        <View style={styles.backgroundFill} />
      </BlurView>
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
    // Figma Header Layer 하단 구분선: 1px, semantic/devider/default
    borderBottomWidth: 1,
    borderBottomColor: colors.divider.default,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Figma base/b&w/whiteopacity: rgba(255, 255, 255, 0.4)
  backgroundFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: palette.whiteOpacity,
  },
  toolbar: {
    minHeight: TOOLBAR_HEIGHT,
  },
});

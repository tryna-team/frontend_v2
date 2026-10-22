import type { ReactNode } from 'react';
import { StyleProp, ViewStyle, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

// # 상수 영역
const BORDER_RADIUS = 30;
const BLUR_INTENSITY = 14;
const BG_COLOR = 'rgba(255, 255, 255, 0.90)';
const OVERLAY_COLOR = 'rgba(191, 191, 191, 0.02)';

// # 타입 영역
type BGProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

// # main component
export default function BG({ children, style }: BGProps) {
  return (
    <View style={[styles.container]}>
      <View style={[styles.inner, style]}>
        <BlurView
          intensity={BLUR_INTENSITY}
          tint="light"
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
        />

        <View pointerEvents="none" style={styles.background} />
        <View pointerEvents="none" style={styles.overlay} />

        {children}
      </View>
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS,
    boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.08)',
  },
  inner: {
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
  },
  background: {
    ...StyleSheet.absoluteFill,
    backgroundColor: BG_COLOR,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: OVERLAY_COLOR,
  },
});
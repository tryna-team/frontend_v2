import type { ReactNode } from 'react';
import { StyleProp, ViewStyle, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

// # 상수 영역
const BORDER_RADIUS = 30;
const BLUR_INTENSITY = 0;
const BG_COLOR = 'rgba(255, 255, 255, 0.90)';
const OVERLAY_COLOR = 'rgba(191, 191, 191, 0.02)';

// # 타입 영역
type BGProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  blur?: number;
};

// # main component
export default function BG({ 
  children, 
  style, 
  borderRadius = BORDER_RADIUS, 
  blur = BLUR_INTENSITY 
}: BGProps) {
  return (
    <View style={[styles.container, { borderRadius }]}>
      <View style={[styles.inner, style, { borderRadius }]}>
        <BlurView
          intensity={blur}
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
    boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.08)',
  },
  inner: {
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
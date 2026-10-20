// src/components/Icon/icons/CircleIcon.tsx
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

import { colors } from '@/theme/colors';
import Dot from './Dot';

// # 타입 영역
type CircleIconProps = SvgProps & {
  size?: number;
  dot?: boolean;
  color?: string;
};

// # Main component
export default function CircleIcon({
  size = 24,
  dot = false,
  color = colors.icon.default,
  ...props
}: CircleIconProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
        <Circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>

      {dot && (
        <View style={styles.dot}>
          <Dot size={size} color={color} />
        </View>
      )}
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  },
});
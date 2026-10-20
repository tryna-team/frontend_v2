import Svg, { Circle } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

import { colors } from '@/theme/colors';

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
      {dot && <Circle cx="12" cy="12" r="8" fill={color} />}
    </Svg>
  );
}
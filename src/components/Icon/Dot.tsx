import Svg, { Circle } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

import { colors } from '@/theme/colors';

// # 타입 영역
type DotIconProps = SvgProps & {
  size?: number;
  color?: string;
};

// # Main component
export default function DotIcon({
  size = 24,
  color = colors.icon.default,
  ...props
}: DotIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Circle cx="12" cy="12" r="6" fill={color} />
    </Svg>
  );
}
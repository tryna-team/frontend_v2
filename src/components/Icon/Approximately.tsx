import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

import { colors } from '@/theme/colors';
// # 상수 영역
const path = "M5 12.0228C6.04519 11.3549 7.25964 11 8.5 11C9.74036 11 10.9548 11.3549 12 12.0228C13.0452 12.6907 14.2596 13.0455 15.5 13.0455C16.7404 13.0455 17.9548 12.6907 19 12.0228";

// # 타입 영역
type ApproximatelyIconProps = SvgProps & {
  size?: number;
  color?: string;
};

// # Main component
export default function ApproximatelyIcon({
  size = 24,
  color = colors.icon.default,
  ...props
}: ApproximatelyIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d={path}
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
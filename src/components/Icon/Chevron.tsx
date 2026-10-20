import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

import { colors } from '@/theme/colors';

// # 상수 영역
const CHEVRON_PATHS = {
  up: 'M20 15.5823L13.413 8.99528C13.0364 8.62409 12.5288 8.41602 12 8.41602C11.4712 8.41602 10.9636 8.62409 10.587 8.99528L4 15.5823',
  down: 'M4 8.41772L10.587 15.0047C10.9636 15.3759 11.4712 15.584 12 15.584C12.5288 15.584 13.0364 15.3759 13.413 15.0047L20 8.41772',
  right: 'M10.417 20L17.004 13.413C17.3752 13.0364 17.5833 12.5288 17.5833 12C17.5833 11.4712 17.3752 10.9636 17.004 10.587L10.417 4',
  left: 'M13.583 4L6.99601 10.587C6.62483 10.9636 6.41675 11.4712 6.41675 12C6.41675 12.5288 6.62483 13.0364 6.99601 13.413L13.583 20',
} as const;

// # 타입 영역
type ChevronDirection = 'up' | 'down' | 'right' | 'left';

type ChevronProps = SvgProps & {
  direction: ChevronDirection;
  size?: number;
  color?: string;
};

// # Main component
export default function Chevron({
  direction,
  size = 24,
  color = colors.icon.default,
  ...props
}: ChevronProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d={CHEVRON_PATHS[direction]}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

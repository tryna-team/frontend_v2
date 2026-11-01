import ButtonBase from '@/components/Button/ButtonBase';
import type { ButtonLayout } from '@/components/Button/ButtonVariants';
import type { ToolbarButtonProps } from './ToolbarButtonType';

// # 상수 영역 (Figma _Button - 44pt)
// 높이 44로 최소 터치 크기를 채우므로 추가 터치 영역(hitSlop)은 두지 않는다
const LAYOUT: ButtonLayout = {
  height: 44,
  paddingHorizontal: 8,
  gap: 4,
  iconSize: 24,
  hitSlop: 0,
};

// TODO: expo-blur intensity(1~100)는 Figma 블러(16px)와 단위가 달라 실기기에서 맞춰봐야 함
const BLUR_INTENSITY = 16;

// # main component
// Toolbar 전용 44pt 버튼. 색·눌림·배경은 Button과 같은 ButtonBase를 쓴다
export default function ToolbarButton(props: ToolbarButtonProps) {
  return <ButtonBase {...props} layout={LAYOUT} blurIntensity={BLUR_INTENSITY} />;
}

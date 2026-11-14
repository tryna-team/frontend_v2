import type { ComponentType } from 'react';
import type { PressableProps } from 'react-native';

import type { palette } from '@/theme/colors';
import type { ButtonAppearance, ButtonBoxSize, ButtonLayout, ButtonSize } from './ButtonVariants';

// # 타입 영역
// Button은 아이콘에 size·color만 넘기므로 그 두 값만 요구한다 (lucide 아이콘, components/Icon 모두 사용 가능)
export type ButtonIcon = ComponentType<{ size?: number; color?: string }>;

// palette 토큰의 색 값 중 하나 (예: palette.grey[100]). colors의 시맨틱 색도 palette 값이라 함께 받는다
// 토큰에 없는 색(직접 적은 hex 등)은 타입 에러가 나므로, 색을 바꿀 때 토큰만 고치면 된다
type Palette = typeof palette;
export type PaletteColor = {
  [K in keyof Palette]: Palette[K] extends string ? Palette[K] : Palette[K][keyof Palette[K]];
}[keyof Palette];

// ## 내용: label·icon을 넘겼는지로 Figma Label Style이 정해진다
// - label만 / label + icon → 텍스트만 / 텍스트+아이콘
// - icon만 → 아이콘만 (스크린 리더용 accessibilityLabel 필수)
export type ButtonContentProps =
  | { label: string; icon?: ButtonIcon; accessibilityLabel?: string }
  | { label?: never; icon: ButtonIcon; accessibilityLabel: string };

// ## ButtonBase: contentArea·Button44가 함께 쓰는 본체. 크기 값과 유리 모양 여부를 받는다
export type ButtonBaseProps = ButtonContentProps & {
  layout: ButtonLayout;
  boxSize?: ButtonBoxSize;
  appearance: ButtonAppearance;
  disabled?: boolean;
  destructive?: boolean;
  bgColor?: PaletteColor;
  shadow?: boolean;
  /** Button44 전용. Bordered는 유리 배경(블러 + 흰색 40%), Borderless는 기본 상태에 그림자 없음 (Figma 44pt) */
  glass?: boolean;
  onPress?: () => void;
  hitSlop?: PressableProps['hitSlop'];
};

// ## contentArea (기본값): Figma Button - Content Area
// TODO: bgColor·shadow는 Button44Props와 같은 prop이라 공통 타입(예: ButtonStyleOptions)으로 묶어 함께 관리하는 것을 검토
//   (boxSize는 두 버튼의 아이콘 처리가 달라 따로 둔다)
export type ContentAreaButtonProps = ButtonContentProps & {
  variant?: 'contentArea';
  size: ButtonSize;
  /**
   * 가로·세로를 직접 지정 (42 → 42×42, '60*28' → 가로 60 × 세로 28). 없으면 size 크기 그대로
   * 여백·간격·아이콘 크기는 size 값을 쓰고, 터치 영역은 최소 44가 되도록 다시 계산한다
   */
  boxSize?: ButtonBoxSize;
  appearance: ButtonAppearance;
  disabled?: boolean;
  /** Figma Destructive. 기본 false. true면 Prominent만 빨간색으로 바뀐다 (다른 appearance는 그대로) */
  destructive?: boolean;
  /**
   * Bordered 배경색. 없으면 Figma 기본값 palette.grey[100]. palette 토큰 값만 받는다 (예: palette.blue[50])
   * Bordered에서만 적용되고, 비활성·눌림일 때는 각 상태의 배경색을 쓴다
   */
  bgColor?: PaletteColor;
  /** 그림자 표시 여부. 기본 false (true일 때만 그림자를 그린다, 비활성일 때는 항상 없음) */
  shadow?: boolean;
  onPress?: () => void;
  /** 버튼 바깥으로 넓힐 터치 영역. 지정하지 않으면 size(boxSize가 있으면 boxSize) 크기에 맞춘 기본값(최소 44) */
  hitSlop?: PressableProps['hitSlop'];
};

// ## cta: 일정 추가 전용 "+" 버튼. 모양·아이콘·접근성 이름 고정 (크기만 boxSize로 바꿀 수 있다)
// TODO: 중복 입력 방지가 필요해지면 disabled 추가 (비활성 디자인 확인 필요)
export type CTAButtonProps = {
  variant: 'cta';
  /**
   * 가로·세로를 직접 지정 (48 → 48×48, '60*52' → 가로 60 × 세로 52). 없으면 52×52
   * 아이콘(22)·모서리(24)는 52 대비 짧은 변의 비율로 함께 바뀌고, 터치 영역은 최소 64가 되도록 다시 계산한다
   */
  boxSize?: ButtonBoxSize;
  onPress?: () => void;
};

export type ButtonProps = ContentAreaButtonProps | CTAButtonProps;

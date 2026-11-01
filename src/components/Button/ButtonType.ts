import type { ComponentType } from 'react';
import type { PressableProps } from 'react-native';

import type { ButtonAppearance, ButtonLayout, ButtonSize } from './ButtonVariants';

// # 타입 영역
// Button은 아이콘에 size·color만 넘기므로 그 두 값만 요구한다 (lucide 아이콘, components/Icon 모두 사용 가능)
export type ButtonIcon = ComponentType<{ size?: number; color?: string }>;

// ## 내용: label·icon을 넘겼는지로 Figma Label Style이 정해진다
// - label만 / label + icon → 텍스트만 / 텍스트+아이콘
// - icon만 → 아이콘만 (스크린 리더용 accessibilityLabel 필수)
export type ButtonContentProps =
  | { label: string; icon?: ButtonIcon; accessibilityLabel?: string }
  | { label?: never; icon: ButtonIcon; accessibilityLabel: string };

// ## ButtonBase: contentArea·ToolbarButton이 함께 쓰는 본체. 크기 값과 블러 세기를 받는다
export type ButtonBaseProps = ButtonContentProps & {
  layout: ButtonLayout;
  blurIntensity: number;
  appearance: ButtonAppearance;
  disabled?: boolean;
  onPress?: () => void;
  hitSlop?: PressableProps['hitSlop'];
};

// ## contentArea (기본값): Figma Button - Content Area
export type ContentAreaButtonProps = ButtonContentProps & {
  variant?: 'contentArea';
  size: ButtonSize;
  appearance: ButtonAppearance;
  disabled?: boolean;
  onPress?: () => void;
  /** 버튼 바깥으로 넓힐 터치 영역. 지정하지 않으면 size별 기본값(최소 44) */
  hitSlop?: PressableProps['hitSlop'];
};

// ## cta: 일정 추가 전용 "+" 버튼. 모양·아이콘·접근성 이름 고정
// TODO: 중복 입력 방지가 필요해지면 disabled 추가 (비활성 디자인 확인 필요)
export type CTAButtonProps = {
  variant: 'cta';
  onPress?: () => void;
};

export type ButtonProps = ContentAreaButtonProps | CTAButtonProps;

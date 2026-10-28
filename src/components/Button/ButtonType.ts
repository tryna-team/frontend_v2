import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react-native';

import type { ButtonAppearance, ButtonSize } from './ButtonVariants';

// # 타입 영역
export type ButtonIcon = ComponentType<LucideProps>;

// ## 내용: label·icon을 넘겼는지로 Figma Label Style이 정해진다
// - label만 / label + icon → 텍스트만 / 텍스트+아이콘
// - icon만 → 아이콘만 (스크린 리더용 accessibilityLabel 필수)
type ButtonContentProps =
  | { label: string; icon?: ButtonIcon; accessibilityLabel?: string }
  | { label?: never; icon: ButtonIcon; accessibilityLabel: string };

type ButtonBaseProps = {
  onPress?: () => void;
};

// ## contentArea (기본값): Figma Button - Content Area
export type ContentAreaButtonProps = ButtonBaseProps &
  ButtonContentProps & {
    variant?: 'contentArea';
    size: ButtonSize;
    appearance: ButtonAppearance;
    disabled?: boolean;
  };

// ## cta: 화면 하단 "+" 버튼 (v1 MainCTAButton). 모양·아이콘 고정
export type CTAButtonProps = ButtonBaseProps & {
  variant: 'cta';
  accessibilityLabel?: string;
  label?: never;
  icon?: never;
  size?: never;
  appearance?: never;
  disabled?: never;
};

export type ButtonProps = ContentAreaButtonProps | CTAButtonProps;
export type ButtonVariant = NonNullable<ButtonProps['variant']>;

// # 종류별 고정값
// ## cta
export const ctaConfig = {
  size: 52,
  iconSize: 22,
  hitSlop: 6, // v1과 같은 64 터치 영역
  accessibilityLabel: '일정 추가', // v1 MainCTAButton 기본값
} as const;

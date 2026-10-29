import type { ButtonContentProps } from '@/components/Button/ButtonType';
import type { ButtonAppearance } from '@/components/Button/ButtonVariants';

// # 타입 영역
// Figma _Button - 44pt: 크기 고정(44), prominent·비활성 없음
// label·icon·accessibilityLabel 규칙은 Button과 같다 (아이콘만이면 accessibilityLabel 필수)
export type ToolbarButtonProps = ButtonContentProps & {
  appearance: Exclude<ButtonAppearance, 'prominent'>;
  onPress?: () => void;
};

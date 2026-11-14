import type { ButtonContentProps, PaletteColor } from '@/components/Button/ButtonType';
import type { ButtonAppearance, ButtonBoxSize } from '@/components/Button/ButtonVariants';

// # 타입 영역
// Figma _Button - 44pt: 기본 크기 44 (boxSize로 변경 가능), prominent·비활성 없음
// label·icon·accessibilityLabel 규칙은 Button과 같다 (아이콘만이면 accessibilityLabel 필수)
// TODO: bgColor·shadow는 ContentAreaButtonProps와 같은 prop이라 공통 타입으로 묶는 것을 검토 (ButtonType.ts의 TODO 참고)
export type Button44Props = ButtonContentProps & {
  appearance: Exclude<ButtonAppearance, 'prominent'>;
  /**
   * 가로·세로를 직접 지정 (40 → 40×40, '60*44' → 가로 60 × 세로 44). 없으면 높이 44
   * 아이콘(24)은 44 대비 짧은 변의 비율로 함께 바뀌고, 터치 영역은 최소 44가 되도록 다시 계산한다
   */
  boxSize?: ButtonBoxSize;
  /**
   * Bordered 배경색. 없으면 Figma 기본 유리 배경(흰색 40%). palette 토큰 값만 받는다 (예: palette.blue[50])
   * Bordered에서만 적용되고 블러는 그대로 둔다. 눌림일 때는 눌림 배경색을 쓴다
   */
  bgColor?: PaletteColor;
  /**
   * 그림자 표시 여부. 기본 false
   * true면 Figma 44pt대로 그린다 (Bordered는 기본·눌림 모두, Borderless는 눌렀을 때만)
   */
  shadow?: boolean;
  onPress?: () => void;
};

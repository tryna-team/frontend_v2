import { Platform, type TextStyle } from 'react-native';

import { colors, palette } from '@/theme/colors';
import { fontFamily } from '@/theme/typography';
import { radius } from '@/theme/radius';

// # 타입 영역
export type ButtonLayout = {
  height: number;
  paddingHorizontal: number;
  gap: number;
  iconSize: number;
};

export type AppearanceStyle = {
  backgroundColor?: string;
  textColor: string;
  iconColor: string;
  glass: boolean; // 블러 + 그림자 (Bordered)
};

// # 크기 표 (contentArea의 size)
// 높이를 고정하고 가운데 정렬하므로 Figma의 세로 여백(4/7/14·15)은 따로 두지 않는다
export const sizeLayouts = {
  small: { height: 28, paddingHorizontal: 10, gap: 3, iconSize: 20 },
  medium: { height: 34, paddingHorizontal: 14, gap: 4, iconSize: 20 },
  large: { height: 50, paddingHorizontal: 20, gap: 4, iconSize: 22 },
} satisfies Record<string, ButtonLayout>;

export type ButtonSize = keyof typeof sizeLayouts;

// # 모양 표 (appearance) - Figma Style
export const appearanceStyles = {
  prominent: {
    backgroundColor: palette.blue[400],
    textColor: colors.text.white,
    iconColor: colors.icon.white,
    glass: false,
  },
  bordered: {
    backgroundColor: palette.whiteOpacity,
    textColor: colors.text.default,
    iconColor: colors.icon.default,
    glass: true,
  },
  borderless: {
    textColor: colors.text.default,
    iconColor: colors.icon.default,
    glass: false,
  },
} satisfies Record<string, AppearanceStyle>;

export type ButtonAppearance = keyof typeof appearanceStyles;

// # 비활성 표
// Prominent·Bordered는 같은 배경(greyOpacity-50)으로 바뀌고 유리 효과는 끈다. Borderless는 배경 없음
export const disabledAppearanceStyles: Record<ButtonAppearance, AppearanceStyle> = {
  prominent: {
    backgroundColor: palette.greyOpacity[50],
    textColor: colors.text.disable,
    iconColor: colors.icon.disable,
    glass: false,
  },
  bordered: {
    backgroundColor: palette.greyOpacity[50],
    textColor: colors.text.disable,
    iconColor: colors.icon.disable,
    glass: false,
  },
  borderless: {
    textColor: colors.text.disable,
    iconColor: colors.icon.disable,
    glass: false,
  },
};

// # 유리 효과 (Bordered)
// Header와 같은 방식: 블러 + 흰색 40% + 그림자(Figma Component/Default)
export const glassStyle = {
  // TODO: expo-blur intensity(1~100)는 Figma 블러(28px)와 단위가 달라 실기기에서 맞춰봐야 함
  intensity: 28,
  tint: Platform.OS === 'web' ? 'default' : 'systemUltraThinMaterialLight',
  boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.08)',
} as const;

// # CTA ("+" 버튼)
export const ctaStyle = {
  backgroundColor: palette.grey[900],
  iconColor: colors.icon.white,
  // TODO: Figma radius/semantic/large(24) ↔ 코드 radius.medium(24) 이름 정리 후 교체
  borderRadius: radius.medium,
  boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.08)',
} as const;

// # 글자 (Figma TDS/Label/Label1)
// ⚠️ Figma는 Wanted Sans 17/500/20/-0.2. 프로젝트에 Wanted Sans와 같은 값의 토큰이 없어
//    폰트만 기본값으로 두고 나머지는 Figma 값을 쓴다. 토큰이 정해지면 교체
export const labelTextStyle: TextStyle = {
  fontFamily: fontFamily.default,
  fontSize: 17,
  fontWeight: '500',
  lineHeight: 20,
  letterSpacing: -0.2,
};

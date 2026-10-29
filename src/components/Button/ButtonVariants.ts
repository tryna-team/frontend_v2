import { Platform, type TextStyle } from 'react-native';

import { colors, palette } from '@/theme/colors';
import { fontFamily } from '@/theme/typography';
import { radius } from '@/theme/radius';

// # 크기 표 (size)
// 높이를 고정하고 가운데 정렬하므로 Figma의 세로 여백(4/7/14·15)은 따로 두지 않는다
// hitSlop: 보이는 크기는 유지하고 터치 영역을 44까지 넓힌다 ((44 - height) / 2)
// ⚠️ hitSlop은 부모 영역 밖으로 넓어지지 않는다. 44를 보장하려면 배치하는 쪽에서 부모 여백을 두거나 hitSlop prop으로 조정한다
//    (버튼 틀 자체를 44로 키우면 레이아웃 크기가 바뀌어 Figma 간격과 달라지므로 그렇게 하지 않는다)
export const sizeLayouts = {
  small: { height: 28, paddingHorizontal: 10, gap: 3, iconSize: 20, hitSlop: 8 },
  medium: { height: 34, paddingHorizontal: 14, gap: 4, iconSize: 20, hitSlop: 5 },
  large: { height: 50, paddingHorizontal: 20, gap: 4, iconSize: 22, hitSlop: 0 },
};

export type ButtonSize = keyof typeof sizeLayouts;
export type ButtonLayout = (typeof sizeLayouts)[ButtonSize];

// # 모양 표 (appearance) - Figma Style
export const appearanceStyles = {
  prominent: { backgroundColor: palette.blue[400], contentColor: colors.text.white },
  bordered: { backgroundColor: palette.whiteOpacity, contentColor: colors.text.default },
  borderless: { backgroundColor: undefined, contentColor: colors.text.default },
};

export type ButtonAppearance = keyof typeof appearanceStyles;

export type ButtonLook = {
  backgroundColor?: string;
  contentColor: string;
  blur: boolean;
  shadow: boolean;
};

// # 상태별 모양 (비활성: Figma Is Disable / 눌림: Figma _Button - 44pt Pressed)
// TODO: Prominent는 임시로 Bordered와 같은 눌림 모양 적용. Prominent 전용 디자인 확정 시 교체
export function resolveLook(
  appearance: ButtonAppearance,
  disabled = false,
  pressed = false,
): ButtonLook {
  const isBorderless = appearance === 'borderless';

  if (disabled) {
    return {
      backgroundColor: isBorderless ? undefined : palette.greyOpacity[50],
      contentColor: colors.text.disable,
      blur: false,
      shadow: false,
    };
  }

  if (pressed) {
    return {
      backgroundColor: palette.greyOpacity[100],
      contentColor: colors.text.default,
      blur: false,
      shadow: true,
    };
  }

  const isBordered = appearance === 'bordered';
  return { ...appearanceStyles[appearance], blur: isBordered, shadow: isBordered };
}

// # 유리 효과 (Bordered)
// Header와 같은 방식: 블러 + 흰색 40%
export const glassStyle = {
  // TODO: expo-blur intensity(1~100)는 Figma 블러(28px)와 단위가 달라 실기기에서 맞춰봐야 함
  intensity: 28,
  tint: Platform.OS === 'web' ? 'default' : 'systemUltraThinMaterialLight',
} as const;

// # 그림자 (Figma Component/Default)
export const shadow = '0px 0px 20px 0px rgba(0, 0, 0, 0.08)';

// # CTA (일정 추가 전용 "+" 버튼, v1 MainCTAButton)
export const ctaStyle = {
  size: 52,
  iconSize: 22,
  hitSlop: 6, // v1과 같은 64 터치 영역
  accessibilityLabel: '일정 추가',
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

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

// # 박스 크기 (boxSize): 버튼의 가로·세로를 직접 지정한다
// 숫자 하나면 정사각형(42 → 42×42), 'n*m'이면 가로 n × 세로 m ('60*28' → 가로 60, 세로 28)
export type ButtonBoxSize = number | `${number}*${number}`;

type Box = { width: number; height: number };

export function parseBoxSize(boxSize?: ButtonBoxSize): Box | undefined {
  if (boxSize === undefined) return undefined;
  if (typeof boxSize === 'number') return { width: boxSize, height: boxSize };
  const [width, height] = boxSize.split('*').map(Number);
  return { width, height };
}

// boxSize로 바꾼 크기에 맞춰 터치 영역을 다시 계산한다 (위 hitSlop과 같은 규칙: (터치 크기 - 가로·세로) / 2)
const MIN_TOUCH_SIZE = 44;

export function touchHitSlop(box: Box, touchSize = MIN_TOUCH_SIZE) {
  const horizontal = Math.max(0, (touchSize - box.width) / 2);
  const vertical = Math.max(0, (touchSize - box.height) / 2);
  return { top: vertical, bottom: vertical, left: horizontal, right: horizontal };
}

// 기준 크기(base) 대비 boxSize 짧은 변의 비율로 값을 키우거나 줄인다 (Button44·CTA의 아이콘·모서리)
export function scaleToBox(value: number, box: Box, base: number) {
  return Math.round((value * Math.min(box.width, box.height)) / base);
}

// # 모양 표 (appearance) - Figma Button - Content Area Style
// (Button44의 Bordered 유리 배경은 아래 glassStyle)
export const appearanceStyles = {
  prominent: { backgroundColor: palette.blue[400], contentColor: colors.text.white },
  bordered: { backgroundColor: palette.grey[100], contentColor: colors.text.default },
  borderless: { backgroundColor: undefined, contentColor: colors.text.default },
};

export type ButtonAppearance = keyof typeof appearanceStyles;

// Figma Destructive=True: Prominent에서만 빨간색으로 바뀐다
const destructiveStyle = { backgroundColor: palette.danger[200], contentColor: colors.text.white };

// resolveLook에 넘기는 버튼 props (ButtonBaseProps를 그대로 넘길 수 있다)
type LookOptions = {
  appearance: ButtonAppearance;
  disabled?: boolean;
  destructive?: boolean;
  bgColor?: string;
  shadow?: boolean;
  glass?: boolean;
};

export type ButtonLook = {
  backgroundColor?: string;
  contentColor: string;
  blur: boolean;
  shadow: boolean;
};

// # 상태별 모양 (비활성: Figma Is Disable / 눌림: Figma _Button - 44pt Pressed)
// 그림자: shadow prop을 켰을 때만 그린다 (Button44 Borderless는 Figma 44pt대로 눌렸을 때만). 비활성일 때는 항상 없다
// TODO: Prominent는 임시로 Bordered와 같은 눌림 모양 적용. Prominent 전용 디자인 확정 시 교체
export function resolveLook(options: LookOptions, pressed = false): ButtonLook {
  const {
    appearance,
    disabled,
    destructive,
    bgColor,
    glass = false,
    shadow: hasShadow = false,
  } = options;
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
      shadow: hasShadow,
    };
  }

  // TODO: 아래 Button44(glass) 분기 2개와 Content Area 기본 분기를 한 경로로 합치는 것을 검토
  //   두 버튼의 차이는 Bordered 기본 배경(흰색 40% / Grey 100)과 블러 여부뿐이라 분기 대신 값으로 고를 수 있다
  //   합치면 bgColor·shadow를 한 곳에서 처리하므로, 새 옵션을 추가할 때 두 버튼에 함께 적용된다
  //   이때 "배경이 없으면 기본 상태에 그림자 없음" 규칙을 Content Area Borderless에도 적용할지 함께 정한다 (아래 TODO)

  // Button44 Bordered: 유리 배경(블러 + 흰색 40%, bgColor가 있으면 그 색) (Figma _Button - 44pt)
  if (glass && appearance === 'bordered') {
    return {
      backgroundColor: bgColor ?? glassStyle.backgroundColor,
      contentColor: colors.text.default,
      blur: true,
      shadow: hasShadow,
    };
  }

  // Button44 Borderless: 배경이 없어 기본 상태엔 그림자를 두지 않는다 (Figma _Button - 44pt)
  if (glass && isBorderless) {
    return { ...appearanceStyles.borderless, blur: false, shadow: false };
  }

  // Content Area 버튼에는 배경 블러가 없다
  const style =
    appearance === 'prominent' && destructive ? destructiveStyle : appearanceStyles[appearance];
  // Bordered는 bgColor prop이 있으면 그 색을 배경으로 쓴다 (없으면 Figma 기본 Grey 100)
  const backgroundColor = appearance === 'bordered' && bgColor ? bgColor : style.backgroundColor;
  // TODO: Content Area Borderless의 shadow 삭제 여부 판단 필요
  //   지금은 shadow를 켜면 기본·눌림 모두 그림자가 생기는데, 기본 상태엔 배경이 없어 투명한 버튼 둘레에 그림자만 보인다
  //   (Button44 Borderless는 Figma 44pt대로 기본 상태에 그림자가 없다)
  return { ...style, backgroundColor, blur: false, shadow: hasShadow };
}

// # 유리 효과 (Figma _Button - 44pt Bordered): 블러 + 흰색 40%, Header와 같은 방식
// Content Area 버튼은 Figma에 블러가 없어 쓰지 않는다 (glass를 넘기는 Button44만 쓴다)
export const glassStyle = {
  // TODO: expo-blur intensity(1~100)는 Figma 블러(16px)와 단위가 달라 실기기에서 맞춰봐야 함
  intensity: 16,
  tint: Platform.OS === 'web' ? 'default' : 'systemUltraThinMaterialLight',
  backgroundColor: palette.whiteOpacity,
} as const;

// # 그림자 (Figma Component/Default)
// Content Area 버튼·Button44: shadow prop으로 켤 때만 쓴다 / CTA: 항상 쓴다
export const shadow = '0px 0px 20px 0px rgba(0, 0, 0, 0.08)';

// # CTA (일정 추가 전용 "+" 버튼, v1 MainCTAButton)
export const ctaStyle = {
  size: 52,
  iconSize: 22,
  hitSlop: 6, // v1과 같은 64 터치 영역
  touchSize: 64, // boxSize로 크기를 바꾸면 이 터치 영역에 맞춰 hitSlop을 다시 계산한다
  accessibilityLabel: '일정 추가',
  backgroundColor: palette.grey[900],
  iconColor: colors.icon.white,
  // TODO: Figma radius/semantic/large(24) ↔ 코드 radius.medium(24) 이름 정리 후 교체
  borderRadius: radius.medium,
  boxShadow: shadow, // Figma Component/Default (Content Area 버튼과 같은 그림자)
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

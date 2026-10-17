import type { TextStyle } from 'react-native';

// # 폰트 상수
export const fontFamily = {
  default: 'Pretendard Variable',
  brand: 'Plus Jakarta Sans',
} as const;

// # Typography 생성 함수
function createTypography(
  family: string,
  fontSize: number,
  fontWeight: TextStyle['fontWeight'],
  lineHeight: number,
  letterSpacing: number,
): TextStyle {
  return {
    fontFamily: family,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
  };
}

// # Typography Tokens
export const typography = {
  default: {
    caption: {
      large: createTypography(fontFamily.default, 11, '400', 15, -0.11),
    },
    label: {
      medium: createTypography(fontFamily.default, 12, '500', 18, -0.12),
      large: createTypography(fontFamily.default, 14, '500', 20, -0.14),
    },
    bodyStrong: {
      small: createTypography(fontFamily.default, 13, '600', 20, -0.13),
      medium: createTypography(fontFamily.default, 15, '600', 22, -0.15),
      large: createTypography(fontFamily.default, 17, '600', 26, -0.17),
    },
    body: {
      small: createTypography(fontFamily.default, 13, '400', 20, -0.13),
      medium: createTypography(fontFamily.default, 15, '500', 22, -0.15),
      large: createTypography(fontFamily.default, 17, '500', 26, -0.17),
    },
    heading: {
      small: createTypography(fontFamily.default, 22, '600', 32, -0.22),
      medium: createTypography(fontFamily.default, 24, '600', 32, -0.24),
      large: createTypography(fontFamily.default, 28, '600', 36, -0.28),
    },
    titleStrong: {
      medium: createTypography(fontFamily.default, 18, '700', 26, -0.18),
      large: createTypography(fontFamily.default, 20, '700', 28, -0.2),
    },
    title: {
      medium: createTypography(fontFamily.default, 18, '500', 26, -0.18),
      large: createTypography(fontFamily.default, 20, '500', 28, -0.2),
    },
    display: createTypography(fontFamily.default, 40, '700', 48, -0.4),
  },

  brand: {
    caption: createTypography(fontFamily.brand, 11, '400', 15, -0.11),
    label: {
      medium: createTypography(fontFamily.brand, 12, '500', 18, -0.12),
      large: createTypography(fontFamily.brand, 14, '500', 20, -0.14),
    },
    body: {
      small: createTypography(fontFamily.brand, 13, '400', 20, -0.13),
      medium: createTypography(fontFamily.brand, 15, '400', 22, -0.15),
      large: createTypography(fontFamily.brand, 17, '400', 26, -0.17),
    },
    bodyStrong: {
      small: createTypography(fontFamily.brand, 13, '500', 20, -0.13),
      medium: createTypography(fontFamily.brand, 15, '500', 22, -0.15),
      large: createTypography(fontFamily.brand, 17, '500', 26, -0.17),
    },
    title: {
      medium: createTypography(fontFamily.brand, 18, '500', 26, -0.18),
      large: createTypography(fontFamily.brand, 20, '500', 28, -0.2),
    },
    titleStrong: {
      large: createTypography(fontFamily.brand, 20, '600', 28, -0.2),
    },
    heading: {
      medium: createTypography(fontFamily.brand, 24, '500', 32, -0.24),
      large: createTypography(fontFamily.brand, 28, '600', 36, -0.28),
    },
    headingStrong: {
      medium: createTypography(fontFamily.brand, 24, '700', 32, -0.24),
    },
    display: createTypography(fontFamily.brand, 40, '700', 48, -0.4),
  },
} as const;

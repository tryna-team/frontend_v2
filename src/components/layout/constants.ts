// Figma Home/Montly 기준 (402×874)
export const TOOLBAR_HEIGHT = 44;

// Footer 96 - 홈 인디케이터 34. 인디케이터 영역은 safe area 값으로 따로 더한다
export const FOOTER_CONTENT_HEIGHT = 62;

// 메인 영역 콘텐츠 여백. Header·Footer에 가려지지 않게 하는 여백(insets)에 더해지는 값이다.
// 이 값을 바꾸면 Layout을 쓰는 모든 화면에 반영된다. 아직 디자인이 정해지지 않아 0으로 둔다.
export const MAIN_CONTENT_PADDING = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
} as const;

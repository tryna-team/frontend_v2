import { Pressable, StyleSheet } from 'react-native';

import ButtonBase from './ButtonBase';
import {
  ctaIcons,
  ctaStyle,
  parseBoxSize,
  scaleToBox,
  shadow,
  sizeLayouts,
  touchHitSlop,
} from './ButtonVariants';
import type { ButtonProps, CTAButtonProps, ContentAreaButtonProps } from './ButtonType';

// # 함수 영역
// ## contentArea: size별 크기 값으로 ButtonBase를 그린다
function renderContentAreaButton(props: ContentAreaButtonProps) {
  return <ButtonBase {...props} layout={sizeLayouts[props.size]} />;
}

// ## cta
// icon(plus·check)으로 아이콘·기본 크기·그림자·접근성 이름이 정해진다
// boxSize를 주면 아이콘·모서리를 아이콘별 기본 크기 대비 비율로 키우거나 줄이고, 터치 영역도 다시 계산한다
function renderCTAButton(props: CTAButtonProps) {
  const {
    icon: Icon,
    size,
    shadow: hasShadow,
    accessibilityLabel,
  } = ctaIcons[props.icon ?? 'plus'];
  const box = parseBoxSize(props.boxSize) ?? { width: size, height: size };

  return (
    <Pressable
      onPress={props.onPress}
      hitSlop={touchHitSlop(box, ctaStyle.touchSize)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.cta,
        { ...box, borderRadius: scaleToBox(ctaStyle.borderRadius, box, size) },
        hasShadow && styles.ctaShadow,
      ]}
    >
      <Icon size={scaleToBox(ctaStyle.iconSize, box, size)} color={ctaStyle.iconColor} />
    </Pressable>
  );
}

// # main component
// variant를 지정하지 않으면 contentArea로 그린다
export default function Button(props: ButtonProps) {
  if (props.variant === 'cta') return renderCTAButton(props);
  return renderContentAreaButton(props);
}

// # 스타일 영역
const styles = StyleSheet.create({
  cta: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ctaStyle.backgroundColor,
  },
  // Figma Component/Default (Content Area 버튼과 같은 그림자)
  ctaShadow: {
    boxShadow: shadow,
  },
});

import { Pressable, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';

import ButtonBase from './ButtonBase';
import { ctaStyle, parseBoxSize, scaleToBox, sizeLayouts, touchHitSlop } from './ButtonVariants';
import type { ButtonProps, CTAButtonProps, ContentAreaButtonProps } from './ButtonType';

// # 함수 영역
// ## contentArea: size별 크기 값으로 ButtonBase를 그린다
function renderContentAreaButton(props: ContentAreaButtonProps) {
  return <ButtonBase {...props} layout={sizeLayouts[props.size]} />;
}

// ## cta
// boxSize를 주면 아이콘·모서리를 기본 크기(52) 대비 비율로 키우거나 줄이고, 터치 영역도 다시 계산한다
function renderCTAButton(props: CTAButtonProps) {
  const box = parseBoxSize(props.boxSize);
  const boxStyle = box && {
    ...box,
    borderRadius: scaleToBox(ctaStyle.borderRadius, box, ctaStyle.size),
  };
  const iconSize = box ? scaleToBox(ctaStyle.iconSize, box, ctaStyle.size) : ctaStyle.iconSize;

  return (
    <Pressable
      onPress={props.onPress}
      hitSlop={box ? touchHitSlop(box, ctaStyle.touchSize) : ctaStyle.hitSlop}
      accessibilityRole="button"
      accessibilityLabel={ctaStyle.accessibilityLabel}
      style={[styles.cta, boxStyle]}
    >
      <Plus size={iconSize} color={ctaStyle.iconColor} />
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
    width: ctaStyle.size,
    height: ctaStyle.size,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ctaStyle.borderRadius,
    backgroundColor: ctaStyle.backgroundColor,
    boxShadow: ctaStyle.boxShadow,
  },
});

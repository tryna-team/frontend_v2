import { Pressable, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';

import ButtonBase from './ButtonBase';
import { ctaStyle, glassStyle, sizeLayouts } from './ButtonVariants';
import type { ButtonProps, CTAButtonProps, ContentAreaButtonProps } from './ButtonType';

// # 함수 영역
// ## contentArea: size별 크기 값으로 ButtonBase를 그린다
function renderContentAreaButton(props: ContentAreaButtonProps) {
  return (
    <ButtonBase
      {...props}
      layout={sizeLayouts[props.size]}
      blurIntensity={glassStyle.intensity}
    />
  );
}

// ## cta
function renderCTAButton(props: CTAButtonProps) {
  return (
    <Pressable
      onPress={props.onPress}
      hitSlop={ctaStyle.hitSlop}
      accessibilityRole="button"
      accessibilityLabel={ctaStyle.accessibilityLabel}
      style={styles.cta}
    >
      <Plus size={ctaStyle.iconSize} color={ctaStyle.iconColor} />
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

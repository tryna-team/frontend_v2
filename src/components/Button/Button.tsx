import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Plus } from 'lucide-react-native';

import { useBlurTarget } from '@/components/Material/BlurTarget';
import { radius } from '@/theme/radius';
import {
  ctaStyle,
  glassStyle,
  labelTextStyle,
  resolveLook,
  shadow,
  sizeLayouts,
} from './ButtonVariants';
import type { ButtonLook } from './ButtonVariants';
import type { ButtonProps, CTAButtonProps, ContentAreaButtonProps } from './ButtonType';

// # 타입 영역
type BackgroundProps = {
  look: ButtonLook;
};

// # 함수 영역
// ## 배경: 블러 → 배경색 순서로 깔고, 모서리 밖은 잘라낸다
function Background({ look }: BackgroundProps) {
  // Android: Header·Footer 안에서는 Layout의 블러 대상을 쓰고, Main 안에서는 반투명으로 대체된다
  const blurTargetProps = useBlurTarget();

  if (!look.blur && !look.backgroundColor) return null;

  return (
    <View pointerEvents="none" style={styles.background}>
      {look.blur && (
        <BlurView
          intensity={glassStyle.intensity}
          tint={glassStyle.tint}
          style={StyleSheet.absoluteFill}
          {...blurTargetProps}
        />
      )}
      {look.backgroundColor && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: look.backgroundColor }]} />
      )}
    </View>
  );
}

// ## contentArea
function renderContentAreaButton(props: ContentAreaButtonProps) {
  const { label, icon: Icon, appearance, disabled } = props;
  const layout = sizeLayouts[props.size];

  return (
    <Pressable
      onPress={props.onPress}
      hitSlop={props.hitSlop ?? layout.hitSlop}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.container,
        { height: layout.height, gap: layout.gap },
        label ? { paddingHorizontal: layout.paddingHorizontal } : { width: layout.height },
        resolveLook(appearance, disabled, pressed).shadow && styles.shadow,
      ]}
    >
      {({ pressed }) => {
        const look = resolveLook(appearance, disabled, pressed);

        return (
          <>
            <Background look={look} />
            {Icon && <Icon size={layout.iconSize} color={look.contentColor} />}
            {!!label && (
              <Text style={[labelTextStyle, { color: look.contentColor }]}>{label}</Text>
            )}
          </>
        );
      }}
    </Pressable>
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  shadow: {
    boxShadow: shadow,
  },
  background: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
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

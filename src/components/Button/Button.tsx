import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Plus } from 'lucide-react-native';

import { radius } from '@/theme/radius';
import {
  appearanceStyles,
  ctaStyle,
  disabledAppearanceStyles,
  glassStyle,
  labelTextStyle,
  sizeLayouts,
} from './ButtonVariants';
import type { AppearanceStyle } from './ButtonVariants';
import { ctaConfig } from './ButtonType';
import type { ButtonProps, CTAButtonProps, ContentAreaButtonProps } from './ButtonType';

// # 타입 영역
type BackgroundProps = {
  look: AppearanceStyle;
};

// # 함수 영역
// ## 배경: 블러 → 배경색 순서로 깔고, 모서리 밖은 잘라낸다
function Background({ look }: BackgroundProps) {
  if (!look.glass && !look.backgroundColor) return null;

  return (
    <View pointerEvents="none" style={styles.background}>
      {/* TODO: Android는 BlurTargetView로 감싸 blurTarget을 연결해야 실제 블러가 적용됨 (현재는 반투명만 표시) */}
      {look.glass && (
        <BlurView
          intensity={glassStyle.intensity}
          tint={glassStyle.tint}
          style={StyleSheet.absoluteFill}
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
  const { label, icon: Icon } = props;
  const layout = sizeLayouts[props.size];
  const look = props.disabled
    ? disabledAppearanceStyles[props.appearance]
    : appearanceStyles[props.appearance];
  const isIconOnly = !label;

  return (
    <Pressable
      onPress={props.onPress}
      disabled={props.disabled}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel}
      accessibilityState={{ disabled: !!props.disabled }}
      style={[
        styles.container,
        { height: layout.height, gap: layout.gap },
        isIconOnly
          ? { width: layout.height }
          : { paddingHorizontal: layout.paddingHorizontal },
        look.glass && styles.glassShadow,
      ]}
    >
      <Background look={look} />
      {Icon && <Icon size={layout.iconSize} color={look.iconColor} />}
      {!!label && (
        <Text style={[labelTextStyle, { color: look.textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
}

// ## cta
function renderCTAButton(props: CTAButtonProps) {
  return (
    <Pressable
      onPress={props.onPress}
      hitSlop={ctaConfig.hitSlop}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel ?? ctaConfig.accessibilityLabel}
      style={styles.cta}
    >
      <Plus size={ctaConfig.iconSize} color={ctaStyle.iconColor} />
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
  glassShadow: {
    boxShadow: glassStyle.boxShadow,
  },
  background: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  cta: {
    width: ctaConfig.size,
    height: ctaConfig.size,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ctaStyle.borderRadius,
    backgroundColor: ctaStyle.backgroundColor,
    boxShadow: ctaStyle.boxShadow,
  },
});

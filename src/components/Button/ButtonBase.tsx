import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';

import { useBlurTarget } from '@/components/Material/BlurTarget';
import { radius } from '@/theme/radius';
import { glassStyle, labelTextStyle, resolveLook, shadow } from './ButtonVariants';
import type { ButtonLook } from './ButtonVariants';
import type { ButtonBaseProps } from './ButtonType';

// # 타입 영역
type BackgroundProps = {
  look: ButtonLook;
  intensity: number;
};

// # 함수 영역
// ## 배경: 블러 → 배경색 순서로 깔고, 모서리 밖은 잘라낸다
function Background({ look, intensity }: BackgroundProps) {
  // Android: Header·Footer 안에서는 Layout의 블러 대상을 쓰고, Main 안에서는 반투명으로 대체된다
  const blurTargetProps = useBlurTarget();

  if (!look.blur && !look.backgroundColor) return null;

  return (
    <View pointerEvents="none" style={styles.background}>
      {look.blur && (
        <BlurView
          intensity={intensity}
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

// # main component
// Button(contentArea)과 ToolbarButton이 함께 쓰는 본체. 크기 값(layout)과 블러 세기만 다르게 받는다
export default function ButtonBase(props: ButtonBaseProps) {
  const { label, icon: Icon, appearance, disabled, layout } = props;

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
            <Background look={look} intensity={props.blurIntensity} />
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
});

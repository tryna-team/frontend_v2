import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';

import { useBlurTarget } from '@/components/Material/BlurTarget';
import { radius } from '@/theme/radius';
import {
  glassStyle,
  labelTextStyle,
  parseBoxSize,
  resolveLook,
  shadow,
  touchHitSlop,
} from './ButtonVariants';
import type { ButtonLook } from './ButtonVariants';
import type { ButtonBaseProps } from './ButtonType';

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

// # main component
// Button(contentArea)과 Button44가 함께 쓰는 본체. 크기 값(layout)과 유리 모양 여부(glass)만 다르게 받는다
export default function ButtonBase(props: ButtonBaseProps) {
  const { label, icon: Icon, disabled, layout } = props;
  // boxSize가 있으면 가로·세로를 덮어쓰고, 터치 영역도 그 크기에 맞춰 다시 계산한다
  const box = parseBoxSize(props.boxSize);

  return (
    <Pressable
      onPress={props.onPress}
      hitSlop={props.hitSlop ?? (box ? touchHitSlop(box) : layout.hitSlop)}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.container,
        { height: layout.height, gap: layout.gap },
        label ? { paddingHorizontal: layout.paddingHorizontal } : { width: layout.height },
        box,
        resolveLook(props, pressed).shadow && styles.shadow,
      ]}
    >
      {({ pressed }) => {
        const look = resolveLook(props, pressed);

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

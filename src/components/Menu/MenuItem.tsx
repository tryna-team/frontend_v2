import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react-native';
import { Text, StyleSheet, Pressable, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { MenuItemProps } from './MenuType';

// # 상수 영역
const ICON_SIZE = 22;

// # 타입 영역
// TODO: dark 모드 추가 -> mode: 'light' | 'dark' 추가
type LeadingProps = {
  icon?: ComponentType<LucideProps>;
  color: string;
};

type MiddleProps = {
  content: string;
  color: string;
};

// # 함수 영역
// ## leading function
function Leading({ icon: Icon, color }: LeadingProps) {
  if (!Icon) return null;
  return <Icon size={ICON_SIZE} color={color} />;
}

// ## middle function
function Middle({ content, color }: MiddleProps) {
  return (
    <View style={styles.middle}>
      <Text style={[styles.text, { color }]}>{content}</Text>
    </View>
  );
}

// # Main component
export default function MenuItem({
  icon,
  status = 'default',
  content,
  onPress,
}: MenuItemProps) {
  const isDestructive = status === 'destructive';

  // TODO: TDS Danger 추가 시 적용
  const iconColor = isDestructive ? '#FF3E41' : colors.icon.default;
  const textColor = isDestructive ? '#FF3E41' : colors.text.default;

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole="button"
        accessibilityState={{ disabled: !onPress }}
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      >
        <Leading icon={icon} color={iconColor} />
        <Middle content={content} color={textColor} />
      </Pressable>
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    // TODO: 임시 레이아웃 지정 -> 피그마와 비교 필요
    paddingHorizontal: 8,
  },
  container: {
    width: '100%',
    minHeight: 42,
    paddingHorizontal: 26,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  pressed: {
    borderRadius: 999,
    backgroundColor: 'rgba(28, 22, 48, 0.05)',
  },
  // TODO: TDS Typo로 교체
  text: {
    fontSize: 17,
    fontWeight: '500',
  },
  middle: {
    flex: 1,
    minWidth: 0,
  },
});

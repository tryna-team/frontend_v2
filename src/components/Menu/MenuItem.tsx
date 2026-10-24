import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react-native';
import { Text, StyleSheet, Pressable, View } from 'react-native';

import { colors } from '@/theme/colors';

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

type MenuItemProps = Omit<LeadingProps, 'color'> & Omit<MiddleProps, 'color'> & {
    status?: 'default' | 'destructive';
    onPress?: () => void;
};

// # 함수 영역
// ## leading function
function Leading({ icon: Icon, color }: LeadingProps) {
  if (!Icon) return null;
  return <Icon size={ICON_SIZE} color={color} />;
}

// ## middle function
function Middle({ content, color }: MiddleProps & { color: string }) {
  return (
    <View style={styles.middle}>
      <Text style={[styles.text, { color: color }]}>{content}</Text>
    </View>
  );
}

// # Main component
export default function MenuItem({
  icon: Icon,
  status = 'default',
  content,
  onPress,
}: MenuItemProps) {
  const isDestructive = status === 'destructive';

  // TODO: TDS Danger 추가 시 적용
  const iconColor = isDestructive ? '#FF3E41' : colors.icon.default;
  const textColor = isDestructive ? '#FF3E41' : colors.text.default;

  return (
    <Pressable 
    onPress={onPress}  
    accessibilityRole="button"
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <Leading icon={Icon} color={iconColor} />
      <Middle content={content} color={textColor} />
    </Pressable>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 42,
    paddingHorizontal: 26,
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

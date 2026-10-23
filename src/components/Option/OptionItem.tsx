import { Pressable, View, Text, StyleSheet } from 'react-native';

import { Check } from 'lucide-react-native';
import DotIcon from '@/components/Icon/Dot';
import { colors } from '@/theme/colors';

import type {
  LeadingProps,
  MiddleProps,
  OptionItemProps,
} from './OptionType';

// # 상수 영역
const ICON_SIZE = 22;

// # 함수 영역
function Leading({
  selection,
  icon,
  iconColor = colors.icon.default,
}: LeadingProps) {
  return (
    <View style={styles.leading}>
      <Check
        size={ICON_SIZE}
        color={iconColor}
        style={!selection && styles.hidden}
      />
      {icon && <DotIcon size={ICON_SIZE} color={iconColor} />}
    </View>
  );
}

function Middle({ content }: MiddleProps) {
  return (
    <View style={styles.middle}>
      {/* 너비 영역을 넘어가면 말줄임표 사용 */}
      {/* TODO: TDS Label1 타이포그래피 적용 */}
      <Text numberOfLines={1} style={styles.content}>
        {content}
      </Text>
    </View>
  );
}

// # main component
export default function OptionItem({
  selection,
  icon,
  iconColor,
  content,
  onPress,
}: OptionItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <Leading selection={selection} icon={icon} iconColor={iconColor} />
      <Middle content={content} />
    </Pressable>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 42,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pressed: {
    borderRadius: 999,
    backgroundColor: 'rgba(28, 22, 48, 0.05)',
  },
  leading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  middle: {
    flex: 1,
    minWidth: 0,
  },
  content: {
    color: colors.text.default,
  },
  hidden: {
    opacity: 0,
  },
});

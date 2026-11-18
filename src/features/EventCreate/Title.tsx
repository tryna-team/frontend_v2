import { StyleSheet, TextInput, View } from 'react-native';
import { CalendarDays } from 'lucide-react-native';

import Button44 from '@/components/Button/Button44/Button44';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

// # 타입 영역
type TitleProps = {
  value: string;
  onChangeText: (text: string) => void;
  onIconPress?: () => void;
  iconBackgroundColor?: string;
  onFocus?: () => void;
};

// # Main component
export default function Title({
  value,
  onChangeText,
  onIconPress,
  iconBackgroundColor,
  onFocus,
}: TitleProps) {
  return (
    <View style={styles.container}>
      {/* Leading */}
      {/* TODO: Button44의 배경색 변경 Props 구현 후,
          부모 View 대신 Button44에 iconBackgroundColor를 직접 적용하도록 수정 */}
      <View
        style={[
          styles.iconContainer,
          iconBackgroundColor
            ? { backgroundColor: iconBackgroundColor }
            : undefined,
        ]}
      >
        <Button44
          icon={CalendarDays}
          appearance="bordered"
          accessibilityLabel="일정 아이콘"
          onPress={onIconPress}
        />
      </View>

      {/* Middle */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder="제목"
        placeholderTextColor={colors.text.disable}
        // TODO: TDS 컬러로 교체
        selectionColor="#0088FF"
        autoCorrect={false}
        returnKeyType="done"
        accessibilityLabel="일정 제목"
      />
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 20,
  },

  iconContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },

  input: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    color: colors.text.default,
    ...typography.default.display,
  },
});
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
};

// # Main component
export default function Title({
  value,
  onChangeText,
  onIconPress,
}: TitleProps) {
  return (
    <View style={styles.container}>
      {/* Leading */}
      <Button44
        icon={CalendarDays}
        appearance="bordered"
        accessibilityLabel="일정 아이콘"
        onPress={onIconPress}
      />

      {/* Middle */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="제목"
        placeholderTextColor={colors.text.disable}
        // TODO: tds 컬러로 교체
        selectionColor={'#0088FF'}
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
  input: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    color: colors.text.default,
    ...typography.default.display,
  },
});

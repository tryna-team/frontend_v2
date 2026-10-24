import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Search, CircleX } from 'lucide-react-native';

import BG from '@/components/Material/BG';
import { colors } from '@/theme/colors';

// # 상수 영역
const BORDER_RADIUS = 1000;
const BLUR = 10;

// # 타입 영역
type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
};

type SearchTrailingProps = {
  onClear: () => void;
};

// # 함수 영역
function Leading() {
  return (
    <Search
      size={24}
      color={colors.icon.disable}
      strokeWidth={1.8}
    />
  );
}

function Trailing({ onClear }: SearchTrailingProps) {
  return (
    <Pressable
      onPress={onClear}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="검색어 지우기"
    >
      <CircleX
        size={18}
        color={colors.icon.additional}
        strokeWidth={1.8}
      />
    </Pressable>
  );
}

// # main component
export default function SearchField({
  value,
  onChangeText,
  placeholder = 'Placeholder',
  onSubmitEditing,
}: SearchFieldProps) {
  const isTyping = value.length > 0;
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <BG
      borderRadius={BORDER_RADIUS}
      blur={BLUR}
      style={styles.background}
    >
      <View
        style={[
          styles.content,
          isTyping ? styles.typing : styles.placeholder,
        ]}
      >
        {!isTyping && <Leading />}

        {/* TODO: 입력필드 커서 커스텀 */}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.disable}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel="검색어 입력"
        />

        {isTyping && <Trailing onClear={handleClear} />}
      </View>
    </BG>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: 48,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  placeholder: {
    gap: 8,
  },
  typing: {
    gap: 4,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: 20,
    padding: 0,
    includeFontPadding: false,
    color: colors.text.default,
    // TODO: TDS 타이포그래피 토큰 추가 시 교체
    fontSize: 17,
    fontWeight: '500',
  },
});

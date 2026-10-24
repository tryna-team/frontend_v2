import { Text, View, StyleSheet } from 'react-native';
import { Scan } from 'lucide-react-native';

import SearchField from './SearchField';
import { colors } from '@/theme/colors';

// # 타입 영역
type ToolbarVariant = 'default' | 'leading' | 'trailing' | 'search';

type ToolbarProps = {
  variant?: ToolbarVariant;
  searchValue?: string;
  onSearchChangeText?: (text: string) => void;
  searchPlaceholder?: string;
  onSearchSubmit?: () => void;
};

type SearchProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
};

// # 함수 영역
function Leading() {
  return (
    <View style={styles.leading}>
      {/* TODO: 공용 Button 컴포넌트 연결 */}
      <Scan size={24} color={colors.icon.default} />

      {/* TODO: Label 디자인 토큰 적용 */}
      <Text>Label</Text>
    </View>
  );
}

function Trailing() {
  return (
    <View style={styles.trailing}>
      {/* TODO: 공용 Button 컴포넌트 연결 및 버튼 Props 처리 */}
      <View style={styles.buttonPlaceholder}>
        <Scan size={24} color={colors.icon.default} />
      </View>
      <View style={styles.buttonPlaceholder}>
        <Scan size={24} color={colors.icon.default} />
      </View>
      <View style={styles.buttonPlaceholder}>
        <Scan size={24} color={colors.icon.default} />
      </View>
    </View>
  );
}

function Search({ value, onChangeText, placeholder, onSubmitEditing }: SearchProps) {
  return (
    <View style={styles.search}>
      <View style={styles.searchContainer}>
        <SearchField
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          onSubmitEditing={onSubmitEditing}
        />
      </View>

      {/* TODO: Search 전용 Button 컴포넌트 연결 (아이콘 고정) */}
      <View style={styles.buttonPlaceholder}>
        <Scan size={24} color={colors.icon.default} />
      </View>
    </View>
  );
}

// # main component
export default function Toolbar({
  variant = 'default',
  searchValue = '',
  onSearchChangeText,
  searchPlaceholder,
  onSearchSubmit,
}: ToolbarProps) {
  const isSearch = variant === 'search';
  const showLeading = variant === 'default' || variant === 'leading';
  const showTrailing = variant === 'default' || variant === 'trailing';

  return (
    <View style={[styles.container, isSearch && styles.searchLayout]}>
      {showLeading && <Leading />}

      {showTrailing && <Trailing />}

      {isSearch && (
        <Search
          value={searchValue}
          onChangeText={onSearchChangeText ?? (() => {})}
          placeholder={searchPlaceholder}
          onSubmitEditing={onSearchSubmit}
        />
      )}
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leading: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 4,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  searchLayout: {
    height: 48,
  },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    minWidth: 0,
  },
  // TODO: 공용 Button 컴포넌트 연결 후 제거
  buttonPlaceholder: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

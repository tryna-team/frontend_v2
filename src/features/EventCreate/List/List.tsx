import type { ComponentType } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import type { LucideProps } from 'lucide-react-native';

import ListItemLayout from '@/components/List/ListItemLayout';

import { colors } from '@/theme/colors';
import { fontFamily } from '@/theme/typography';

// # 타입 영역
type ListProps = {
  icon: ComponentType<LucideProps>;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
};

// # Main component
export default function List({
  icon: Icon,
  placeholder,
  value,
  onChangeText,
}: ListProps) {
  return (
    <View style={styles.container}>
      <ListItemLayout
        leading={
          <Icon
            size={24}
            color={colors.icon.additional}
          />
        }
        middle={
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.text.disable}
            style={styles.input}
            accessibilityLabel={placeholder}
          />
        }
        gap={16}
        style={styles.layout}
      />
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 50,
    justifyContent: 'center',
  },

  layout: {
    paddingHorizontal: 16,
  },

  input: {
    flex: 1,
    minWidth: 0,
    padding: 0,

    fontFamily: fontFamily.default,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.2,

    color: colors.text.default,
    includeFontPadding: false,
  },
});
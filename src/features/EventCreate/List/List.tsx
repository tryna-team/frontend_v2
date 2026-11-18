import type { ComponentType } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { LucideProps } from 'lucide-react-native';

import ListItemLayout from '@/components/List/ListItemLayout';

import { colors } from '@/theme/colors';
import { fontFamily } from '@/theme/typography';

// # 타입 영역
type BaseListProps = {
  icon: ComponentType<LucideProps>;
  placeholder: string;
};

type InputListProps = BaseListProps & {
  variant?: 'input';
  value: string;
  onChangeText: (text: string) => void;
};

type ModalListProps = BaseListProps & {
  variant: 'modal';
  value?: string;
  onPress: () => void;
};

type ListProps = InputListProps | ModalListProps;

// # Main component
export default function List(props: ListProps) {
  const { icon: Icon, placeholder } = props;

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
          props.variant === 'modal' ? (
            <Pressable
              onPress={props.onPress}
              style={styles.middle}
              accessibilityRole="button"
              accessibilityLabel={placeholder}
            >
              <Text
                style={[
                  styles.text,
                  !props.value && styles.placeholder,
                ]}
                numberOfLines={1}
              >
                {props.value || placeholder}
              </Text>
            </Pressable>
          ) : (
            <TextInput
              value={props.value}
              onChangeText={props.onChangeText}
              placeholder={placeholder}
              placeholderTextColor={colors.text.disable}
              style={styles.input}
              accessibilityLabel={placeholder}
            />
          )
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

  // ## Middle
  middle: {
    minHeight: 50,
    justifyContent: 'center',
  },

  text: {
    fontFamily: fontFamily.default,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.2,
    color: colors.text.default,
    includeFontPadding: false,
  },

  placeholder: {
    color: colors.text.disable,
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
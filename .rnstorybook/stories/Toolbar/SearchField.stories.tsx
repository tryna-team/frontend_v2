import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useArgs } from 'storybook/preview-api';
import { View, StyleSheet } from 'react-native';

import SearchField from '../../../src/components/Toolbar/SearchField';

// # 타입 영역
type SearchFieldProps = ComponentProps<typeof SearchField>;

// # 함수 영역
function RenderSearchField(args: SearchFieldProps) {
  const [, updateArgs] = useArgs();

  const handleChangeText = (text: string) => {
    updateArgs({ value: text });
    args.onChangeText(text);
  };

  return <SearchField {...args} onChangeText={handleChangeText} />;
}

// # 상수 영역
const meta = {
  title: 'Components/Toolbar/SearchField',
  component: SearchField,

  argTypes: {
    value: {
      control: 'text',
      description: '검색어 입력값',
    },
    placeholder: {
      control: 'text',
      description: '검색어가 없을 때 표시할 텍스트',
    },
    onChangeText: {
      control: false,
    },
    onSubmitEditing: {
      control: false,
    },
  },

  args: {
    value: '',
    placeholder: '검색',
    onChangeText: () => {},
    onSubmitEditing: () => {},
  },

  decorators: [
    (Story) => (
      <View style={styles.preview}>
        <Story />
      </View>
    ),
  ],

  render: RenderSearchField,
} satisfies Meta<typeof SearchField>;

export default meta;

// # Story 영역
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Typing: Story = {
  args: {
    value: '검색어 입력 중',
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: '일정을 검색하세요',
  },
};

// # 스타일 영역
const styles = StyleSheet.create({
  preview: {
    width: '100%',
    padding: 24,
    backgroundColor: '#E8E8ED',
  },
});
import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';

import OptionItem from '../../../src/components/Option/OptionItem';

// # 타입 영역
type OptionItemStoryProps = {
  content: string;
  selection: boolean;
  icon: boolean;
  iconColor: string;
};

// # 함수 영역
function OptionItemPreview({
  content,
  selection,
  icon,
  iconColor,
}: OptionItemStoryProps) {
  const [isSelected, setIsSelected] = useState(selection);

  useEffect(() => {
    setIsSelected(selection);
  }, [selection]);

  return (
    <OptionItem
      content={content}
      selection={isSelected}
      icon={icon}
      iconColor={iconColor}
      onPress={() => setIsSelected((prev) => !prev)}
    />
  );
}

// # 상수 영역
const meta = {
  title: 'Components/Option/OptionItem',
  component: OptionItemPreview,

  argTypes: {
    content: {
      control: 'text',
      description: '옵션 텍스트',
    },
    selection: {
      control: 'boolean',
      description: '선택 여부',
    },
    icon: {
      control: 'boolean',
      description: 'Dot 아이콘 표시 여부',
    },
    iconColor: {
      control: 'color',
      description: 'Dot 아이콘 색상',
    },
  },

  args: {
    content: '옵션',
    selection: false,
    icon: false,
    iconColor: '#FF9F80',
  },

  decorators: [
    (Story) => (
      <View style={styles.preview}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof OptionItemPreview>;

export default meta;

// # Story 영역
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    content: '선택된 옵션',
    selection: true,
  },
};

export const WithIcon: Story = {
  args: {
    content: '개인 캘린더',
    icon: true,
    iconColor: '#FF9F80',
  },
};

export const SelectedWithIcon: Story = {
  args: {
    content: '업무 캘린더',
    selection: true,
    icon: true,
    iconColor: '#6BA9FF',
  },
};

export const LongContent: Story = {
  args: {
    content: '매우 긴 옵션 텍스트가 표시 영역을 초과하는 경우',
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
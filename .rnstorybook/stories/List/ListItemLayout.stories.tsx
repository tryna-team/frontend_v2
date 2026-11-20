import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text, StyleSheet } from 'react-native';

import ListItemLayout from '../../../src/components/List/ListItemLayout';

// # 타입 영역
type ListItemLayoutStoryProps = {
  content: string;
  selected: boolean;
  date?: string;
  time?: string;
  gap: number;
  trailingColor: string;
};

// # 함수 영역
function Leading({ selected }: { selected: boolean }) {
  return (
    <View style={styles.circle}>
      {selected && <View style={styles.dot} />}
    </View>
  );
}

function ListItemLayoutPreview({
  content,
  selected,
  date,
  time,
  gap,
  trailingColor,
}: ListItemLayoutStoryProps) {
  return (
    <ListItemLayout
      leading={<Leading selected={selected} />}
      middle={
        <Text style={styles.middleText} numberOfLines={1}>
          {content}
        </Text>
      }
      date={date}
      time={time}
      gap={gap}
      trailingStyle={{ color: trailingColor }}
    />
  );
}

// # 상수 영역
const meta = {
  title: 'Components/List/ListItemLayout',
  component: ListItemLayoutPreview,

  argTypes: {
    content: {
      control: 'text',
      description: 'Middle 영역 텍스트',
    },
    selected: {
      control: 'boolean',
      description: 'Leading 선택 상태',
    },
    date: {
      control: 'text',
      description: 'Trailing 날짜',
    },
    time: {
      control: 'text',
      description: 'Trailing 시간',
    },
    gap: {
      control: {
        type: 'number',
        min: 0,
        max: 40,
        step: 1,
      },
      description: 'Leading과 Middle 사이 간격',
    },
    trailingColor: {
      control: 'color',
      description: 'Trailing 텍스트 색상',
    },
  },

  args: {
    content: '할 일',
    selected: false,
    date: '11월 21일',
    time: '10:30',
    gap: 8,
    trailingColor: '#777580',
  },

  decorators: [
    (Story) => (
      <View style={styles.preview}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ListItemLayoutPreview>;

export default meta;

// # Story 영역
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    content: '선택된 할 일',
    selected: true,
  },
};

export const WithoutTrailing: Story = {
  args: {
    content: '날짜와 시간이 없는 할 일',
    date: '',
    time: '',
  },
};

export const DateOnly: Story = {
  args: {
    content: '날짜만 있는 할 일',
    date: '11월 21일',
    time: '',
  },
};

export const TimeOnly: Story = {
  args: {
    content: '시간만 있는 할 일',
    date: '',
    time: '10:30',
  },
};

export const LongContent: Story = {
  args: {
    content: '매우 긴 할 일 텍스트가 표시 영역을 초과하는 경우',
  },
};

export const CustomGap: Story = {
  args: {
    content: '간격을 변경한 할 일',
    gap: 16,
  },
};

// # 스타일 영역
const styles = StyleSheet.create({
  preview: {
    width: '100%',
    padding: 24,
    backgroundColor: '#E8E8ED',
  },

  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#777580',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#777580',
  },

  middleText: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: -0.2,
    color: 'rgba(28, 22, 48, 0.30)',
  },
});

import type { Meta, StoryObj } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';

import EventTitle from '../../../src/components/Event/EventTitle';

// # Storybook 설정
const meta = {
  title: 'Components/Event/EventTitle',
  component: EventTitle,

  argTypes: {
    title: {
      control: 'text',
      description: '일정 제목',
    },
    showIcon: {
      control: 'boolean',
      description: '24시간 아이콘 표시 여부',
    },
  },

  args: {
    title: '팀플 회의',
    showIcon: false,
  },

  decorators: [
    (Story) => (
      <View style={styles.preview}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EventTitle>;

export default meta;

// # Story 영역
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    title: '하루종일 일정',
    showIcon: true,
  },
};

export const LongTitle: Story = {
  args: {
    title: '매우 긴 일정 제목이 표시 영역을 초과하는 경우',
  },
};

export const EmptyTitle: Story = {
  args: {
    title: '',
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

import type { Meta, StoryObj } from '@storybook/react-native';

import { colors } from '../../../src/theme/colors';
import Chevron from '../../../src/components/Icon/Chevron';

// # Meta
const meta = {
  title: 'Components/Icon/Chevron',
  component: Chevron,
  tags: ['autodocs'],

  args: {
    direction: 'right',
    size: 24,
    color: colors.icon.default,
  },

  argTypes: {
    direction: {
      control: 'select',
      options: ['up', 'down', 'left', 'right'],
      description: '아이콘 방향',
    },
    size: {
      control: {
        type: 'number',
        min: 1,
        step: 1,
      },
      description: '아이콘 크기',
    },
    color: {
      control: 'color',
      description: '아이콘 색상',
    },
  },
} satisfies Meta<typeof Chevron>;

export default meta;

// # 타입 영역
type Story = StoryObj<typeof meta>;

// # Story
export const Default: Story = {};

export const Up: Story = {
  args: {
    direction: 'up',
  },
};

export const Down: Story = {
  args: {
    direction: 'down',
  },
};

export const Left: Story = {
  args: {
    direction: 'left',
  },
};

export const Right: Story = {
  args: {
    direction: 'right',
  },
};

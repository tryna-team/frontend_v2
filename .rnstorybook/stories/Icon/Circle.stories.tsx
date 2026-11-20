import type { Meta, StoryObj } from '@storybook/react-native';

import { colors } from '../../../src/theme/colors';
import CircleIcon from '../../../src/components/Icon/Circle';

// # Meta
const meta = {
  title: 'Components/Icon/CircleIcon',
  component: CircleIcon,
  tags: ['autodocs'],

  args: {
    size: 24,
    color: colors.icon.default,
    dot: false,
  },

  argTypes: {
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
    dot: {
      control: 'boolean',
      description: '중앙 Dot 표시 여부',
    },
  },
} satisfies Meta<typeof CircleIcon>;

export default meta;

// # 타입 영역
type Story = StoryObj<typeof meta>;

// # Story
export const Default: Story = {};

export const Selected: Story = {
  args: {
    dot: true,
  },
};

export const Unselected: Story = {
  args: {
    dot: false,
  },
};

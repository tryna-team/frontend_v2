import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import { colors } from '@/theme/colors';
import Number24Icon from '../../../src/components/Icon/24hour';

// # Meta
const meta = {
  title: 'Components/Icon/Number24Icon',
  component: Number24Icon,
  tags: ['autodocs'],

  args: {
    size: 24,
    color: colors.icon.default,
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
  },
} satisfies Meta<typeof Number24Icon>;

export default meta;

// # 타입 영역
type Story = StoryObj<typeof meta>;

// # Story
export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/react-native';

import { colors } from '../../../src/theme/colors';
import ApproximatelyIcon from '../../../src/components/Icon/Approximately';

// # Meta
const meta = {
  title: 'Components/Icon/ApproximatelyIcon',
  component: ApproximatelyIcon,
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
} satisfies Meta<typeof ApproximatelyIcon>;

export default meta;

// # 타입 영역
type Story = StoryObj<typeof meta>;

// # Story
export const Default: Story = {};

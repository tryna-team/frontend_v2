import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';

import Separator from './Separator';

// # 상수 영역
const meta = {
  title: 'Components/Material/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <View style={{ width: 320, paddingVertical: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Separator>;

export default meta;

// # 타입 영역
type Story = StoryObj<typeof meta>;

// # Story 영역
export const Default: Story = {};

export const BetweenItems: Story = {
  render: () => (
    <View>
      <View style={{ padding: 16 }}>
        <Text>첫 번째 항목</Text>
      </View>

      <Separator />

      <View style={{ padding: 16 }}>
        <Text>두 번째 항목</Text>
      </View>

      <Separator />

      <View style={{ padding: 16 }}>
        <Text>세 번째 항목</Text>
      </View>
    </View>
  ),
};
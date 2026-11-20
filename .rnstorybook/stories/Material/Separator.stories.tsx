
import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text, StyleSheet } from 'react-native';

import Separator from '../../../src/components/Material/Separator';

// # 상수 영역
const meta = {
  title: 'Components/Material/Separator',
  component: Separator,
  decorators: [
    (Story) => (
      <View style={styles.preview}>
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
      <View style={styles.item}>
        <Text>첫 번째 항목</Text>
      </View>

      <Separator />

      <View style={styles.item}>
        <Text>두 번째 항목</Text>
      </View>

      <Separator />

      <View style={styles.item}>
        <Text>세 번째 항목</Text>
      </View>
    </View>
  ),
};

// # 스타일 영역
const styles = StyleSheet.create({
  preview: {
    width: '100%',
    paddingVertical: 16,
  },
  item: {
    padding: 16,
  },
});

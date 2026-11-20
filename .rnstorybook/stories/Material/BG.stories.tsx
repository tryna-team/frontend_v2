
import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text, StyleSheet } from 'react-native';

import BG from '@/components/Material/BG';

// # 상수 영역
const meta = {
  title: 'Components/Material/BG',
  component: BG,
  argTypes: {
    borderRadius: {
      control: {
        type: 'number',
        min: 0,
        max: 100,
      },
      description: '배경의 모서리 둥글기',
    },
    blur: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
      description: 'BlurView의 블러 강도',
    },
    style: {
      control: false,
    },
    children: {
      control: false,
    },
  },
  args: {
    borderRadius: 30,
    blur: 0,
  },
  decorators: [
    (Story) => (
      <View style={styles.preview}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof BG>;

export default meta;

// # 타입 영역
type Story = StoryObj<typeof meta>;

// # Story 영역
export const Default: Story = {
  render: (args) => (
    <BG {...args} style={styles.content}>
      <Text style={styles.title}>BG Component</Text>
      <Text style={styles.description}>기본 배경 및 그림자 스타일</Text>
    </BG>
  ),
};

export const Rounded: Story = {
  args: {
    borderRadius: 50,
  },
  render: (args) => (
    <BG {...args} style={styles.content}>
      <Text style={styles.title}>Rounded BG</Text>
      <Text style={styles.description}>borderRadius: 50</Text>
    </BG>
  ),
};

export const Blur: Story = {
  args: {
    blur: 30,
  },
  render: (args) => (
    <BG {...args} style={styles.content}>
      <Text style={styles.title}>Blur BG</Text>
      <Text style={styles.description}>blur: 30</Text>
    </BG>
  ),
};

// # 스타일 영역
const styles = StyleSheet.create({
  preview: {
    width: '100%',
    padding: 24,
    backgroundColor: '#E8E8ED',
  },
  content: {
    minHeight: 120,
    padding: 20,
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1630',
  },
  description: {
    fontSize: 14,
    color: 'rgba(28, 22, 48, 0.6)',
  },
});

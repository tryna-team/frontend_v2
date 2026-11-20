import type { Meta, StoryObj } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';
import {
  Pencil,
  Copy,
  Share2,
  Trash2,
  CalendarDays,
} from 'lucide-react-native';

import MenuItem from '../../../src/components/Menu/MenuItem';

// # 타입 영역
type IconName = 'none' | 'pencil' | 'copy' | 'share' | 'trash' | 'calendar';

type MenuItemStoryProps = {
  content: string;
  status: 'default' | 'destructive';
  iconName: IconName;
  disabled: boolean;
};

// # 상수 영역
const ICON_MAP = {
  none: undefined,
  pencil: Pencil,
  copy: Copy,
  share: Share2,
  trash: Trash2,
  calendar: CalendarDays,
};

// # 함수 영역
function MenuItemPreview({
  content,
  status,
  iconName,
  disabled,
}: MenuItemStoryProps) {
  return (
    <MenuItem
      content={content}
      status={status}
      icon={ICON_MAP[iconName]}
      onPress={
        disabled
          ? undefined
          : () => console.log(`MenuItem: ${content}`)
      }
    />
  );
}

// # 상수 영역
const meta = {
  title: 'Components/Menu/MenuItem',
  component: MenuItemPreview,

  argTypes: {
    content: {
      control: 'text',
      description: '메뉴 텍스트',
    },
    status: {
      control: 'select',
      options: ['default', 'destructive'],
      description: '메뉴 상태',
    },
    iconName: {
      control: 'select',
      options: ['none', 'pencil', 'copy', 'share', 'trash', 'calendar'],
      description: 'Leading 아이콘',
    },
    disabled: {
      control: 'boolean',
      description: '터치 비활성화 여부',
    },
  },

  args: {
    content: '수정',
    status: 'default',
    iconName: 'pencil',
    disabled: false,
  },

  decorators: [
    (Story) => (
      <View style={styles.preview}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof MenuItemPreview>;

export default meta;

// # Story 영역
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Destructive: Story = {
  args: {
    content: '삭제',
    status: 'destructive',
    iconName: 'trash',
  },
};

export const WithoutIcon: Story = {
  args: {
    content: '수정',
    iconName: 'none',
  },
};

export const Disabled: Story = {
  args: {
    content: '비활성화된 메뉴',
    disabled: true,
  },
};

export const LongContent: Story = {
  args: {
    content: '매우 긴 메뉴 텍스트가 표시 영역을 초과하는 경우',
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
import type { Meta, StoryObj } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';
import {
  CalendarDays,
  Pencil,
  Copy,
  Share2,
  Trash2,
} from 'lucide-react-native';

import Menu from '../../../src/components/Menu/Menu';
import type { MenuItemData } from '../../../src/components/Menu/MenuType';

// # 상수 영역
const DEFAULT_ITEMS: MenuItemData[] = [
  {
    id: 'edit',
    icon: Pencil,
    content: '수정',
    onPress: () => console.log('수정'),
  },
  {
    id: 'copy',
    icon: Copy,
    content: '복제',
    onPress: () => console.log('복제'),
  },
  {
    id: 'delete',
    icon: Trash2,
    content: '삭제',
    status: 'destructive',
    onPress: () => console.log('삭제'),
  },
];

const NORMAL_ITEMS: MenuItemData[] = [
  {
    id: 'calendar',
    icon: CalendarDays,
    content: '캘린더 변경',
    onPress: () => console.log('캘린더 변경'),
  },
  {
    id: 'share',
    icon: Share2,
    content: '공유',
    onPress: () => console.log('공유'),
  },
  {
    id: 'copy',
    icon: Copy,
    content: '복제',
    onPress: () => console.log('복제'),
  },
];

const DESTRUCTIVE_ITEMS: MenuItemData[] = [
  {
    id: 'delete',
    icon: Trash2,
    content: '삭제',
    status: 'destructive',
    onPress: () => console.log('삭제'),
  },
];

const WITHOUT_ICON_ITEMS: MenuItemData[] = [
  {
    id: 'edit',
    content: '수정',
    onPress: () => console.log('수정'),
  },
  {
    id: 'copy',
    content: '복제',
    onPress: () => console.log('복제'),
  },
  {
    id: 'delete',
    content: '삭제',
    status: 'destructive',
    onPress: () => console.log('삭제'),
  },
];

const LONG_CONTENT_ITEMS: MenuItemData[] = [
  {
    id: 'long',
    icon: Pencil,
    content: '매우 긴 메뉴 텍스트가 표시 영역을 초과하는 경우',
    onPress: () => console.log('긴 메뉴'),
  },
  {
    id: 'delete',
    icon: Trash2,
    content: '삭제',
    status: 'destructive',
    onPress: () => console.log('삭제'),
  },
];

// # 상수 영역
const meta = {
  title: 'Components/Menu/Menu',
  component: Menu,

  argTypes: {
    items: {
      control: 'object',
      description: 'MenuItem 목록',
    },
  },

  args: {
    items: DEFAULT_ITEMS,
  },

  decorators: [
    (Story) => (
      <View style={styles.preview}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Menu>;

export default meta;

// # Story 영역
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Normal: Story = {
  args: {
    items: NORMAL_ITEMS,
  },
};

export const Destructive: Story = {
  args: {
    items: DESTRUCTIVE_ITEMS,
  },
};

export const WithoutIcon: Story = {
  args: {
    items: WITHOUT_ICON_ITEMS,
  },
};

export const LongContent: Story = {
  args: {
    items: LONG_CONTENT_ITEMS,
  },
};

export const Empty: Story = {
  args: {
    items: [],
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
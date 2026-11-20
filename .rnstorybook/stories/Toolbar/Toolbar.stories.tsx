
import type { Meta, StoryObj } from '@storybook/react-native';
import { useArgs } from 'storybook/preview-api';
import { View, StyleSheet } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import {
  ArrowLeft,
  CalendarDays,
  Ellipsis,
  Plus,
  Search,
} from 'lucide-react-native';

import Toolbar from '../../../src/components/Toolbar/Toolbar';

// # 타입 영역
type ToolbarButton = {
  icon: LucideIcon;
  onPress?: () => void;
  accessibilityLabel: string;
};

type ToolbarStoryProps = {
  variant?: 'default' | 'search';

  leadingIcon?: LucideIcon;
  leadingLabel?: string;
  leadingAccessibilityLabel?: string;
  leadingOnPress?: () => void;
  trailingButtons?: ToolbarButton[];

  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChangeText?: (text: string) => void;
  onSearchSubmit?: () => void;
  searchButtonOnPress?: () => void;
};

// # 함수 영역
function ToolbarPreview(args: ToolbarStoryProps) {
  if (args.variant === 'search') {
    return (
      <Toolbar
        variant="search"
        searchValue={args.searchValue ?? ''}
        searchPlaceholder={args.searchPlaceholder}
        onSearchChangeText={args.onSearchChangeText ?? (() => {})}
        onSearchSubmit={args.onSearchSubmit}
        searchButtonOnPress={args.searchButtonOnPress ?? (() => {})}
      />
    );
  }

  if (args.leadingIcon && args.leadingLabel) {
    return (
      <Toolbar
        variant="default"
        leadingIcon={args.leadingIcon}
        leadingLabel={args.leadingLabel}
        leadingAccessibilityLabel={args.leadingAccessibilityLabel}
        leadingOnPress={args.leadingOnPress}
        trailingButtons={args.trailingButtons}
      />
    );
  }

  if (args.leadingIcon) {
    return (
      <Toolbar
        variant="default"
        leadingIcon={args.leadingIcon}
        leadingAccessibilityLabel={
          args.leadingAccessibilityLabel ?? 'Toolbar 버튼'
        }
        leadingOnPress={args.leadingOnPress}
        trailingButtons={args.trailingButtons}
      />
    );
  }

  if (args.leadingLabel) {
    return (
      <Toolbar
        variant="default"
        leadingLabel={args.leadingLabel}
        leadingAccessibilityLabel={args.leadingAccessibilityLabel}
        leadingOnPress={args.leadingOnPress}
        trailingButtons={args.trailingButtons}
      />
    );
  }

  return (
    <Toolbar
      variant="default"
      trailingButtons={args.trailingButtons}
    />
  );
}

function RenderToolbar(args: ToolbarStoryProps) {
  const [, updateArgs] = useArgs<ToolbarStoryProps>();

  return (
    <ToolbarPreview
      {...args}
      onSearchChangeText={(text: string) => {
        updateArgs({ searchValue: text });
        args.onSearchChangeText?.(text);
      }}
    />
  );
}

// # Meta
const meta = {
  title: 'Components/Toolbar/Toolbar',
  component: ToolbarPreview,

  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'search'],
      description: 'Toolbar 레이아웃 유형',
    },
    leadingIcon: { control: false },
    leadingLabel: { control: 'text' },
    leadingAccessibilityLabel: { control: 'text' },
    trailingButtons: { control: false },
    leadingOnPress: { control: false },
    searchValue: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    onSearchChangeText: { control: false },
    onSearchSubmit: { control: false },
    searchButtonOnPress: { control: false },
  },

  decorators: [
    (Story) => (
      <View style={styles.preview}>
        <Story />
      </View>
    ),
  ],

  render: RenderToolbar,
} satisfies Meta<typeof ToolbarPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

// # Story 영역
export const Default: Story = {
  args: {
    variant: 'default',
    leadingIcon: ArrowLeft,
    leadingLabel: '일정',
    trailingButtons: [
      {
        icon: Plus,
        accessibilityLabel: '추가',
        onPress: () => {},
      },
      {
        icon: Ellipsis,
        accessibilityLabel: '더보기',
        onPress: () => {},
      },
    ],
  },
};

export const LeadingIcon: Story = {
  args: {
    variant: 'default',
    leadingIcon: ArrowLeft,
    leadingAccessibilityLabel: '뒤로가기',
    leadingOnPress: () => {},
  },
};

export const LeadingLabel: Story = {
  args: {
    variant: 'default',
    leadingLabel: '캘린더',
    leadingOnPress: () => {},
  },
};

export const LeadingWithLabel: Story = {
  args: {
    variant: 'default',
    leadingIcon: CalendarDays,
    leadingLabel: '캘린더',
    leadingOnPress: () => {},
  },
};

export const Trailing: Story = {
  args: {
    variant: 'default',
    trailingButtons: [
      {
        icon: Search,
        accessibilityLabel: '검색',
        onPress: () => {},
      },
      {
        icon: Plus,
        accessibilityLabel: '추가',
        onPress: () => {},
      },
      {
        icon: Ellipsis,
        accessibilityLabel: '더보기',
        onPress: () => {},
      },
    ],
  },
};

export const SearchVariant: Story = {
  args: {
    variant: 'search',
    searchValue: '',
    searchPlaceholder: '검색',
    onSearchChangeText: () => {},
    onSearchSubmit: () => {},
    searchButtonOnPress: () => {},
  },
};

// # 스타일 영역
const styles = StyleSheet.create({
  preview: {
    width: '100%',
    paddingVertical: 24,
    backgroundColor: '#E8E8ED',
  },
});

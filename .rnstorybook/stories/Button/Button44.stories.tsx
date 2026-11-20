
import type { Meta, StoryObj } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';
import {
  X,
  ChevronLeft,
  Search,
  CalendarDays,
  MoreHorizontal,
} from 'lucide-react-native';

import Button44 from '../../../src/components/Button/Button44/Button44';
import type { ButtonIcon } from '../../../src/components/Button/ButtonType';
import type { ButtonBoxSize } from '../../../src/components/Button/ButtonVariants';
import { palette } from '../../../src/theme/colors';

// # 타입 영역
type IconName = 'none' | 'close' | 'back' | 'search' | 'calendar' | 'more';
type Appearance = 'bordered' | 'borderless';
type BackgroundColor = 'default' | 'grey' | 'blue';

type Button44StoryProps = {
  appearance: Appearance;
  label: string;
  iconName: IconName;
  shadow: boolean;
  boxSize: string;
  bgColor: BackgroundColor;
};

// # 상수 영역
const ICON_MAP: Record<IconName, ButtonIcon | undefined> = {
  none: undefined,
  close: X,
  back: ChevronLeft,
  search: Search,
  calendar: CalendarDays,
  more: MoreHorizontal,
};

const BG_COLOR_MAP = {
  default: undefined,
  grey: palette.grey[100],
  blue: palette.blue[50],
};

// # 함수 영역
function parseStoryBoxSize(value: string): ButtonBoxSize | undefined {
  const input = value.trim();

  if (!input) {
    return undefined;
  }

  if (/^\d+(?:\.\d+)?$/.test(input)) {
    const size = Number(input);

    return Number.isFinite(size) && size > 0
      ? size
      : undefined;
  }

  if (!/^\d+(?:\.\d+)?\*\d+(?:\.\d+)?$/.test(input)) {
    return undefined;
  }

  const [width, height] = input.split('*').map(Number);

  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return undefined;
  }

  return `${width}*${height}`;
}

function Button44Preview({
  appearance,
  label,
  iconName,
  shadow,
  boxSize,
  bgColor,
}: Button44StoryProps) {
  const Icon = ICON_MAP[iconName];

  const commonProps = {
    boxSize: parseStoryBoxSize(boxSize),
    onPress: () => console.log('Button44 Pressed'),
  };

  if (appearance === 'bordered') {
    if (label) {
      return (
        <Button44
          {...commonProps}
          appearance="bordered"
          label={label}
          icon={Icon}
          shadow={shadow}
          bgColor={BG_COLOR_MAP[bgColor]}
        />
      );
    }

    return (
      <Button44
        {...commonProps}
        appearance="bordered"
        icon={Icon ?? X}
        accessibilityLabel="Toolbar 버튼"
        shadow={shadow}
        bgColor={BG_COLOR_MAP[bgColor]}
      />
    );
  }

  if (label) {
    return (
      <Button44
        {...commonProps}
        appearance="borderless"
        label={label}
        icon={Icon}
      />
    );
  }

  return (
    <Button44
      {...commonProps}
      appearance="borderless"
      icon={Icon ?? X}
      accessibilityLabel="Toolbar 버튼"
    />
  );
}

// # Meta
const meta = {
  title: 'Components/Button/Button44',
  component: Button44Preview,

  argTypes: {
    appearance: {
      control: 'select',
      options: ['bordered', 'borderless'],
      description: 'Button44 외형',
    },
    label: {
      control: 'text',
      description: '버튼 텍스트',
    },
    iconName: {
      control: 'select',
      options: ['none', 'close', 'back', 'search', 'calendar', 'more'],
      description: '아이콘 종류',
    },
    shadow: {
      control: 'boolean',
      description: 'Bordered 그림자 표시',
    },
    boxSize: {
      control: 'text',
      description: '사용자 지정 크기 (예: 40 또는 60*44)',
    },
    bgColor: {
      control: 'select',
      options: ['default', 'grey', 'blue'],
      description: 'Bordered 배경색',
    },
  },

  args: {
    appearance: 'bordered',
    label: '',
    iconName: 'close',
    shadow: false,
    boxSize: '',
    bgColor: 'default',
  },

  decorators: [
    (Story) => (
      <View style={styles.preview}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Button44Preview>;

export default meta;

type Story = StoryObj<typeof meta>;

// # Story 영역
export const Default: Story = {};

export const Borderless: Story = {
  args: { appearance: 'borderless' },
};

export const WithLabel: Story = {
  args: {
    label: '완료',
    iconName: 'none',
  },
};

export const LabelAndIcon: Story = {
  args: {
    label: '뒤로',
    iconName: 'back',
  },
};

export const WithShadow: Story = {
  args: { shadow: true },
};

export const CustomBackground: Story = {
  args: { bgColor: 'blue' },
};

export const CustomBoxSize: Story = {
  args: { boxSize: '60*44' },
};

// # 스타일 영역
const styles = StyleSheet.create({
  preview: {
    width: '100%',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E8ED',
  },
});

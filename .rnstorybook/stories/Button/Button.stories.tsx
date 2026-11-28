
import type { Meta, StoryObj } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';
import {
  CalendarDays,
  Plus,
  Trash2,
  Check,
  Search,
} from 'lucide-react-native';

import Button from '../../../src/components/Button/Button';
import type { ButtonIcon } from '../../../src/components/Button/ButtonType';
import type {
  ButtonAppearance,
  ButtonBoxSize,
  ButtonSize,
  CTAIcon,
} from '../../../src/components/Button/ButtonVariants';
import { palette, type PaletteColor } from '../../../src/theme/colors';

// # 타입 영역
type IconName = 'none' | 'calendar' | 'plus' | 'trash' | 'check' | 'search';

// # 상수 영역
const ICON_MAP: Record<IconName, ButtonIcon | undefined> = {
  none: undefined,
  calendar: CalendarDays,
  plus: Plus,
  trash: Trash2,
  check: Check,
  search: Search,
};

const BG_COLOR_MAP = {
  default: undefined,
  grey: palette.grey[100],
  blue: palette.blue[50],
  danger: palette.danger[200],
} satisfies Record<string, PaletteColor | undefined>;

// # 타입 영역
type BackgroundColor = keyof typeof BG_COLOR_MAP;

type ButtonStoryProps = {
  variant: 'contentArea' | 'cta';
  ctaIcon: CTAIcon;
  appearance: ButtonAppearance;
  size: ButtonSize;
  label: string;
  iconName: IconName;
  disabled: boolean;
  destructive: boolean;
  shadow: boolean;
  boxSize: string;
  bgColor: BackgroundColor;
};

// # 함수 영역
function parseStoryBoxSize(value: string): ButtonBoxSize | undefined {
  if (!value.trim()) return undefined;

  const square = Number(value);

  if (Number.isFinite(square) && square > 0) {
    return square;
  }

  const match = value.match(/^(\d+(?:\.\d+)?)\*(\d+(?:\.\d+)?)$/);

  if (!match) return undefined;

  const width = Number(match[1]);
  const height = Number(match[2]);

  if (width <= 0 || height <= 0) return undefined;

  return `${width}*${height}`;
}

function ButtonPreview({
  variant,
  ctaIcon,
  appearance,
  size,
  label,
  iconName,
  disabled,
  destructive,
  shadow,
  boxSize,
  bgColor,
}: ButtonStoryProps) {
  const Icon = ICON_MAP[iconName];
  const parsedBoxSize = parseStoryBoxSize(boxSize);

  if (variant === 'cta') {
    return (
      <Button
        variant="cta"
        icon={ctaIcon}
        boxSize={parsedBoxSize}
        onPress={() => console.log('CTA 버튼')}
      />
    );
  }

  const commonProps = {
    size,
    disabled,
    destructive,
    boxSize: parsedBoxSize,
    onPress: () => console.log('Button Pressed'),
  };

  const contentProps = label
    ? { label, icon: Icon }
    : Icon
      ? { icon: Icon, accessibilityLabel: '아이콘 버튼' }
      : { label: '버튼' };

  if (appearance === 'bordered') {
    return (
      <Button
        {...commonProps}
        {...contentProps}
        appearance="bordered"
        shadow={shadow}
        bgColor={BG_COLOR_MAP[bgColor]}
      />
    );
  }

  return (
    <Button
      {...commonProps}
      {...contentProps}
      appearance={appearance}
    />
  );
}

// # Storybook 설정
const meta = {
  title: 'Components/Button/Button',
  component: ButtonPreview,

  argTypes: {
    variant: {
      control: 'select',
      options: ['contentArea', 'cta'],
      description: '버튼 Variant',
    },
    ctaIcon: {
      control: 'select',
      options: ['plus', 'check'],
      description: 'CTA 아이콘 (CTA에만 적용)',
    },
    appearance: {
      control: 'select',
      options: ['prominent', 'bordered', 'borderless'],
      description: '버튼 외형 (CTA에는 적용되지 않음)',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '버튼 크기 (CTA에는 적용되지 않음)',
    },
    label: {
      control: 'text',
      description: '버튼 텍스트',
    },
    iconName: {
      control: 'select',
      options: ['none', 'calendar', 'plus', 'trash', 'check', 'search'],
      description: '아이콘 종류',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 여부',
    },
    destructive: {
      control: 'boolean',
      description: 'Destructive 상태 (Prominent에만 적용)',
    },
    shadow: {
      control: 'boolean',
      description: 'Bordered 그림자 표시',
    },
    boxSize: {
      control: 'text',
      description: '사용자 지정 크기 (예: 42 또는 60*28)',
    },
    bgColor: {
      control: 'select',
      options: Object.keys(BG_COLOR_MAP),
      description: 'Bordered 배경색 (Palette 토큰)',
    },
  },

  args: {
    variant: 'contentArea',
    ctaIcon: 'plus',
    appearance: 'prominent',
    size: 'medium',
    label: '버튼',
    iconName: 'none',
    disabled: false,
    destructive: false,
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
} satisfies Meta<typeof ButtonPreview>;

export default meta;

// # Story 영역
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Prominent: Story = {
  args: {
    appearance: 'prominent',
  },
};

export const Bordered: Story = {
  args: {
    appearance: 'bordered',
  },
};

export const Borderless: Story = {
  args: {
    appearance: 'borderless',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const WithIcon: Story = {
  args: {
    label: '일정 추가',
    iconName: 'plus',
  },
};

export const IconOnly: Story = {
  args: {
    label: '',
    iconName: 'search',
  },
};

export const Destructive: Story = {
  args: {
    appearance: 'prominent',
    label: '삭제',
    iconName: 'trash',
    destructive: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithShadow: Story = {
  args: {
    appearance: 'bordered',
    shadow: true,
  },
};

export const CustomBackground: Story = {
  args: {
    appearance: 'bordered',
    bgColor: 'blue',
  },
};

export const CustomBoxSize: Story = {
  args: {
    boxSize: '60*28',
    label: '확인',
  },
};

export const CTA: Story = {
  args: {
    variant: 'cta',
  },
};

export const CTACheck: Story = {
  args: {
    variant: 'cta',
    ctaIcon: 'check',
  },
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

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';

import Option from '../../../src/components/Option/Option';
import type {
  SectionData,
  OptionProps,
} from '../../../src/components/Option/OptionType';

// # 타입 영역
type OptionStoryProps = {
  sections: OptionProps['sections'];
};

// # 함수 영역
function OptionPreview({ sections }: OptionStoryProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    sections.flatMap((section) =>
      section.items
        .filter((item) => item.selection)
        .map((item) => item.id),
    ),
  );

  const handleSelect = (id: string) => {
    setSelectedIds([id]);
  };

  const previewSections: SectionData[] = sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      selection: selectedIds.includes(item.id),
      onPress: () => handleSelect(item.id),
    })),
  }));

  return <Option sections={previewSections} />;
}

// # 상수 영역
const meta = {
  title: 'Components/Option/Option',
  component: OptionPreview,

  argTypes: {
    sections: {
      control: false,
      description: 'Section 단위로 구성된 옵션 목록',
    },
  },

  decorators: [
    (Story) => (
      <View style={styles.preview}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof OptionPreview>;

export default meta;

// # Story 영역
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sections: [
      {
        items: [
          { id: '1', content: '없음', selection: true },
          { id: '2', content: '매일', selection: false },
          { id: '3', content: '매주', selection: false },
          { id: '4', content: '매월', selection: false },
        ],
      },
    ],
  },
};

export const WithTitle: Story = {
  args: {
    sections: [
      {
        title: '반복',
        items: [
          { id: '1', content: '없음', selection: true },
          { id: '2', content: '매일', selection: false },
          { id: '3', content: '매주', selection: false },
        ],
      },
    ],
  },
};

export const MultipleSections: Story = {
  args: {
    sections: [
      {
        title: '반복',
        items: [
          { id: '1', content: '없음', selection: true },
          { id: '2', content: '매일', selection: false },
          { id: '3', content: '매주', selection: false },
        ],
      },
      {
        title: '알림',
        items: [
          { id: '4', content: '이벤트 시간', selection: false },
          { id: '5', content: '5분 전', selection: false },
          { id: '6', content: '10분 전', selection: false },
        ],
      },
    ],
  },
};

export const WithIcon: Story = {
  args: {
    sections: [
      {
        title: '캘린더',
        items: [
          {
            id: '1',
            content: '개인',
            selection: true,
            icon: true,
            iconColor: '#FF9F80',
          },
          {
            id: '2',
            content: '업무',
            selection: false,
            icon: true,
            iconColor: '#6BA9FF',
          },
          {
            id: '3',
            content: '기타',
            selection: false,
            icon: true,
            iconColor: '#9B8FE8',
          },
        ],
      },
    ],
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
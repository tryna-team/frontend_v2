
import type { Meta, StoryObj } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';

import EventList from '../../../src/components/Event/EventList';
import type {
  EventListItemData,
} from '../../../src/components/Event/EventType';

// # 타입 영역
type EventListStoryProps = {
  itemCount: number;
  selectedCount: number;
  showTrailing: boolean;
};

// # 상수 영역
const LABELS = [
  '회의 자료 준비',
  '발표 자료 검토',
  '회의록 작성',
  '결과 공유',
];

// # 함수 영역
function EventListPreview({
  itemCount,
  selectedCount,
  showTrailing,
}: EventListStoryProps) {
  const items: EventListItemData[] = LABELS.slice(0, itemCount).map(
    (label, index) => ({
      id: String(index + 1),
      label,
      selection: index < selectedCount,
      date: showTrailing ? '11월 21일' : undefined,
      time: showTrailing ? '10:30' : undefined,
      onPress: () => console.log(`Item ${index + 1} Pressed`),
    }),
  );

  return (
    <EventList
      items={items}
      onEventPress={() => console.log('Event Pressed')}
      onLongPress={() => console.log('Event Long Pressed')}
    />
  );
}

// # Storybook 설정
const meta = {
  title: 'Components/Event/EventList',
  component: EventListPreview,

  argTypes: {
    itemCount: {
      control: {
        type: 'range',
        min: 0,
        max: 4,
        step: 1,
      },
      description: '목록 항목 개수',
    },
    selectedCount: {
      control: {
        type: 'range',
        min: 0,
        max: 4,
        step: 1,
      },
      description: '완료된 항목 개수',
    },
    showTrailing: {
      control: 'boolean',
      description: '날짜 및 시간 표시 여부',
    },
  },

  args: {
    itemCount: 3,
    selectedCount: 1,
    showTrailing: false,
  },

  decorators: [
    (Story) => (
      <View style={styles.preview}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EventListPreview>;

export default meta;

// # Story 영역
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleItem: Story = {
  args: {
    itemCount: 1,
    selectedCount: 0,
  },
};

export const FourItems: Story = {
  args: {
    itemCount: 4,
  },
};

export const AllSelected: Story = {
  args: {
    itemCount: 4,
    selectedCount: 4,
  },
};

export const WithTrailing: Story = {
  args: {
    showTrailing: true,
  },
};

export const Empty: Story = {
  args: {
    itemCount: 0,
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


import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';

import EventListItem from '../../../src/components/Event/EventListItem';

// # 타입 영역
type EventListItemStoryProps = {
  label: string;
  selection: boolean;
  date: string;
  time: string;
  interactive: boolean;
};

// # 함수 영역
function InteractiveEventListItem({
  label,
  selection,
  date,
  time,
}: Omit<EventListItemStoryProps, 'interactive'>) {
  const [isSelected, setIsSelected] = useState(selection);

  return (
    <EventListItem
      label={label}
      selection={isSelected}
      date={date || undefined}
      time={time || undefined}
      onPress={() => setIsSelected((prev) => !prev)}
      onLongPress={() => console.log('EventListItem Long Pressed')}
    />
  );
}

function EventListItemPreview(props: EventListItemStoryProps) {
  if (props.interactive) {
    return (
      <InteractiveEventListItem
        key={String(props.selection)}
        label={props.label}
        selection={props.selection}
        date={props.date}
        time={props.time}
      />
    );
  }

  return (
    <EventListItem
      label={props.label}
      selection={props.selection}
      date={props.date || undefined}
      time={props.time || undefined}
      onPress={() => console.log('EventListItem Pressed')}
      onLongPress={() => console.log('EventListItem Long Pressed')}
    />
  );
}

// # Storybook 설정
const meta = {
  title: 'Components/Event/EventListItem',
  component: EventListItemPreview,

  argTypes: {
    label: {
      control: 'text',
      description: '할 일 텍스트',
    },
    selection: {
      control: 'boolean',
      description: '완료 여부',
    },
    date: {
      control: 'text',
      description: 'Trailing 날짜',
    },
    time: {
      control: 'text',
      description: 'Trailing 시간',
    },
    interactive: {
      control: 'boolean',
      description: '터치 시 선택 상태 변경',
    },
  },

  args: {
    label: '회의 자료 준비',
    selection: false,
    date: '11월 21일',
    time: '10:30',
    interactive: false,
  },

  decorators: [
    (Story) => (
      <View style={styles.preview}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EventListItemPreview>;

export default meta;

// # Story 영역
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    label: '완료된 할 일',
    selection: true,
  },
};

export const WithoutTrailing: Story = {
  args: {
    label: '날짜와 시간이 없는 할 일',
    date: '',
    time: '',
  },
};

export const DateOnly: Story = {
  args: {
    date: '11월 21일',
    time: '',
  },
};

export const TimeOnly: Story = {
  args: {
    date: '',
    time: '10:30',
  },
};

export const LongContent: Story = {
  args: {
    label: '매우 긴 할 일 텍스트가 표시 영역을 초과하는 경우',
  },
};

export const Interactive: Story = {
  args: {
    label: '터치하여 완료 상태 변경',
    interactive: true,
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

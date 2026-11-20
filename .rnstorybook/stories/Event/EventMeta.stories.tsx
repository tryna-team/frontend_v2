
import type { Meta, StoryObj } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';

import EventMeta from '../../../src/components/Event/EventMeta';
import type {
  EventMetaProps,
} from '../../../src/components/Event/EventType';

// # 타입 영역
type EventMetaStoryProps = {
  state: EventMetaProps['state'];
  startTime: string;
  endTime: string;
  linkedLabel: string;
};

// # 함수 영역
function EventMetaPreview({
  state,
  startTime,
  endTime,
  linkedLabel,
}: EventMetaStoryProps) {
  if (state === 'startToEnd') {
    return (
      <EventMeta
        state="startToEnd"
        startTime={startTime}
        endTime={endTime}
      />
    );
  }

  if (state === 'startTime') {
    return (
      <EventMeta
        state="startTime"
        startTime={startTime}
      />
    );
  }

  if (state === 'linked') {
    return (
      <EventMeta
        state="linked"
        linkedLabel={linkedLabel}
      />
    );
  }

  return <EventMeta state="allday" />;
}

// # Storybook 설정
const meta = {
  title: 'Components/Event/EventMeta',
  component: EventMetaPreview,

  argTypes: {
    state: {
      control: 'select',
      options: ['startToEnd', 'startTime', 'allday', 'linked'],
      description: 'Meta 표시 상태',
    },
    startTime: {
      control: 'text',
      description: '시작 시간',
    },
    endTime: {
      control: 'text',
      description: '종료 시간',
    },
    linkedLabel: {
      control: 'text',
      description: '연결된 일정 정보',
    },
  },

  args: {
    state: 'startToEnd',
    startTime: '09:00',
    endTime: '11:00',
    linkedLabel: '이벤트\n10월 3일',
  },

  decorators: [
    (Story) => (
      <View style={styles.preview}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EventMetaPreview>;

export default meta;

// # Story 영역
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StartToEnd: Story = {
  args: {
    state: 'startToEnd',
  },
};

export const StartTime: Story = {
  args: {
    state: 'startTime',
  },
};

export const AllDay: Story = {
  args: {
    state: 'allday',
  },
};

export const Linked: Story = {
  args: {
    state: 'linked',
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

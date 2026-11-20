
import type { Meta, StoryObj } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';

import Event from '../../../src/components/Event/Event';
import type {
  EventListItemData,
  EventMetaProps,
  EventVariant,
} from '../../../src/components/Event/EventType';

// # 타입 영역
type ContentType = 'titleOnly' | 'listOnly' | 'titleAndList';
type MetaState = EventMetaProps['state'];

type EventStoryProps = {
  variant: EventVariant;
  contentType: ContentType;
  metaState: MetaState;
  startTime: string;
  endTime: string;
  linkedLabel: string;
  title: string;
  showIcon: boolean;
  itemCount: number;
};

// # 상수 영역
const ITEMS: EventListItemData[] = [
  {
    id: '1',
    label: '회의 자료 준비',
    selection: false,
    date: '11월 21일',
    time: '10:30',
  },
  {
    id: '2',
    label: '발표 자료 검토',
    selection: true,
  },
  {
    id: '3',
    label: '회의록 작성',
    selection: false,
  },
  {
    id: '4',
    label: '결과 공유',
    selection: false,
  },
];

// # 함수 영역
function EventPreview({
  variant,
  contentType,
  metaState,
  startTime,
  endTime,
  linkedLabel,
  title,
  showIcon,
  itemCount,
}: EventStoryProps) {
  const meta: EventMetaProps =
    metaState === 'startToEnd'
      ? { state: 'startToEnd', startTime, endTime }
      : metaState === 'startTime'
        ? { state: 'startTime', startTime }
        : metaState === 'linked'
          ? { state: 'linked', linkedLabel }
          : { state: 'allday' };

  const items = ITEMS.slice(0, itemCount);

  const commonProps = {
    variant,
    meta,
    onPress: () => console.log('Event Pressed'),
    onLongPress: () => console.log('Event Long Pressed'),
  };

  if (contentType === 'listOnly') {
    return <Event {...commonProps} items={items} />;
  }

  if (contentType === 'titleOnly') {
    return (
      <Event
        {...commonProps}
        title={{ title, showIcon }}
      />
    );
  }

  return (
    <Event
      {...commonProps}
      title={{ title, showIcon }}
      items={items}
    />
  );
}

// # Storybook 설정
const meta = {
  title: 'Components/Event/Event',
  component: EventPreview,

  argTypes: {
    variant: {
      control: 'select',
      options: ['bordered', 'borderless'],
      description: 'Event 외형',
    },
    contentType: {
      control: 'select',
      options: ['titleOnly', 'listOnly', 'titleAndList'],
      description: '제목 및 목록 구성',
    },
    metaState: {
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
    title: {
      control: 'text',
      description: '일정 제목',
    },
    showIcon: {
      control: 'boolean',
      description: '24시간 아이콘 표시',
    },
    itemCount: {
      control: {
        type: 'range',
        min: 0,
        max: 4,
        step: 1,
      },
      description: '표시할 목록 개수',
    },
  },

  args: {
    variant: 'bordered',
    contentType: 'titleAndList',
    metaState: 'startToEnd',
    startTime: '09:00',
    endTime: '11:00',
    linkedLabel: '이벤트\n10월 3일',
    title: '팀플 회의',
    showIcon: false,
    itemCount: 3,
  },

  decorators: [
    (Story) => (
      <View style={styles.preview}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EventPreview>;

export default meta;

// # Story 영역
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Borderless: Story = {
  args: {
    variant: 'borderless',
  },
};

export const TitleOnly: Story = {
  args: {
    contentType: 'titleOnly',
  },
};

export const ListOnly: Story = {
  args: {
    contentType: 'listOnly',
  },
};

export const AllDay: Story = {
  args: {
    metaState: 'allday',
    title: '하루종일 일정',
  },
};

export const StartTimeOnly: Story = {
  args: {
    metaState: 'startTime',
    title: '종료 시간이 없는 일정',
  },
};

export const Linked: Story = {
  args: {
    metaState: 'linked',
    title: '연결된 일정',
  },
};

export const With24HourIcon: Story = {
  args: {
    showIcon: true,
  },
};

export const FourItems: Story = {
  args: {
    itemCount: 4,
  },
};

export const LongTitle: Story = {
  args: {
    title: '매우 긴 일정 제목이 표시 영역을 초과하는 경우',
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

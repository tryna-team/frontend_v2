import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { tempDesignValues } from '@/theme/tempDesignValues';
import { typography } from '@/theme/typography';
import EventBlock from './EventBlock';
import type { EventsProps } from '../CalendarType';

// # 상수 영역
const { eventBlock, events } = tempDesignValues;

// # 타입 영역
type MoreEventsProps = {
  count: number;
};

// # 함수 영역
// ## 칸에 다 못 그린 일정 수
// TODO: Figma에 초과 표시 디자인이 없어 v1처럼 "+N" 글자만 둔다. 디자이너 확인 후 교체
function MoreEvents({ count }: MoreEventsProps) {
  return (
    <View style={styles.more}>
      <Text style={styles.moreText}>+{count}</Text>
    </View>
  );
}

// # Main component
// Figma Events. 칸 폭 전체를 쓰고, 블록과 칸 경계 사이 여백은 EventBlock이 둔다.
// 받은 줄은 모두 칸(일정 영역) 안에 들어간다. 넘치는 일정은 getWeekEventLayout이 +N으로 바꿔 둔다
export default function Events({ slots, hiddenCount }: EventsProps) {
  return (
    <View style={styles.container}>
      {slots.map(({ key, height, block }) => (
        <View key={key} style={{ height }}>
          {block && <EventBlock {...block} />}
        </View>
      ))}
      {hiddenCount > 0 && <MoreEvents count={hiddenCount} />}
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    gap: events.gap,
  },
  // 한 줄 블록의 제목과 같은 위치에서 시작한다 (칸 경계 여백 + 블록 안쪽 여백)
  more: {
    height: events.moreHeight,
    justifyContent: 'center',
    paddingHorizontal: events.inset + eventBlock.paddingHorizontal,
  },
  // 일정 블록 제목과 같은 글자에 보조 글자색을 쓴다. 행간(15)이 줄 높이와 같아 잘리지 않는다
  moreText: {
    ...typography.default.caption.large,
    color: colors.text.additional,
  },
});

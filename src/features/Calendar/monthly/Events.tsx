import { StyleSheet, View } from 'react-native';

import { tempDesignValues } from '@/theme/tempDesignValues';
import EventBlock from './EventBlock';
import type { EventsProps } from '../CalendarType';

// # Main component
// Figma Events. 칸 폭 전체를 쓰고, 블록과 칸 경계 사이 여백은 EventBlock이 둔다
// TODO: 줄 높이의 합이 일정 영역(요약형 55, 상세형 145)보다 크면 다음 주 영역을 침범한다.
//   예: 요약형의 1줄 2개 + Detail, Detail 2개 / 상세형의 Detail 4개
//   초과 표시 디자인이 정해지면 getWeekEventLayout에서 표시 줄 수를 제한한다
export default function Events({ slots }: EventsProps) {
  return (
    <View style={styles.container}>
      {slots.map(({ key, height, block }) => (
        <View key={key} style={{ height }}>
          {block && <EventBlock {...block} />}
        </View>
      ))}
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    gap: tempDesignValues.events.gap,
  },
});

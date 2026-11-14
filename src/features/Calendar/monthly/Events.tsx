import { StyleSheet, View } from 'react-native';

import { tempDesignValues } from '@/theme/tempDesignValues';
import EventBlock from './EventBlock';
import type { EventsProps } from '../CalendarType';

// # Main component
// Figma Events. 칸 폭 전체를 쓰고, 블록과 칸 경계 사이 여백은 EventBlock이 둔다
// TODO: 줄 높이의 합이 일정 영역(요약형 55, 상세형 145)보다 크면 칸 아래로 넘친다.
//   요약형은 모두 한 줄(15·16)이라 4줄(최대 70)이어도 다음 주 구분선에 닿는 데서 멈추고,
//   상세형은 Detail 4개(186)처럼 다음 주 영역을 침범한다
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

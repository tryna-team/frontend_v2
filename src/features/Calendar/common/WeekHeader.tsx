import { StyleSheet, View } from 'react-native';

import CalendarDay from './CalendarDay';
import { WEEKDAY_NAMES } from '../utils/monthGrid';

// # Main component
// Figma Week Header (Calender=Monthly). 일~토 요일 글자를 Week Body와 같은 7칸(부모 폭의 1/7)에 놓는다
// 주간 변형(요일 + 날짜 숫자)은 주간 화면 작업 때 추가
export default function WeekHeader() {
  return (
    <View style={styles.container}>
      {WEEKDAY_NAMES.map((name, dayOfWeek) => (
        <View key={name} style={styles.column}>
          <CalendarDay labelStyle="weekOnly" dayOfWeek={dayOfWeek} />
        </View>
      ))}
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
});

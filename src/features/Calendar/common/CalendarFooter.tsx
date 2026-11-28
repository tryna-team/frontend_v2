import { StyleSheet, View } from 'react-native';

import Button from '@/components/Button/Button';
import { tempDesignValues } from '@/theme/tempDesignValues';
import type { CalendarFooterProps } from '../CalendarType';

// # 상수 영역
const { homeFooter } = tempDesignValues;

// # Main component
// Figma Home/Montly·Home/Yearly의 Footer 버튼 줄("오늘", "+"). Layout의 footer로 넘긴다
export default function CalendarFooter({ onPressToday, onPressCreate }: CalendarFooterProps) {
  return (
    <View style={styles.container}>
      <Button size="large" appearance="bordered" label="오늘" onPress={onPressToday} />
      <Button variant="cta" onPress={onPressCreate} />
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  // 버튼은 아래 끝을 맞춘다. 버튼 사이 빈 곳의 터치는 아래 달력으로 넘긴다
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: homeFooter.paddingTop,
    paddingHorizontal: homeFooter.paddingHorizontal,
    pointerEvents: 'box-none',
  },
});

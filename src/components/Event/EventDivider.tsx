import { StyleSheet, View } from 'react-native';

import { palette } from '@/theme/colors';

// # 임시 디자인 수치
// TODO: TDS 토큰 정해지면 교체 (tempDesignValues.ts 머지 후 이동)
const DIVIDER_WIDTH = 4;

// # Main component
// Figma _Divider: 일정 왼쪽 세로 바. 높이는 부모(Event 행)를 채운다
export default function EventDivider() {
  return <View style={styles.bar} />;
}

// # 스타일 영역
const styles = StyleSheet.create({
  bar: {
    alignSelf: 'stretch',
    width: DIVIDER_WIDTH,
    // TODO: 일정 색 Semantic 토큰 없음. 일단 green 고정, 일정별 색 정해지면 props로 받기
    backgroundColor: palette.green[500],
  },
});

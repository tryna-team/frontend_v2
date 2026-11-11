import { StyleSheet, Text, View } from 'react-native';

import Number24Icon from '@/components/Icon/24hour';
import { colors } from '@/theme/colors';
import { fontFamily } from '@/theme/typography';

import type { EventTitleProps } from './EventType';

// # 임시 디자인 수치
// TODO: TDS 토큰 정해지면 교체 (tempDesignValues.ts 머지 후 이동)
const ICON_SIZE = 18;
const ICON_GAP = 2;

// # Main component
// Figma _Title: 일정 제목. showIcon이면 앞에 24 아이콘 (Label Style=Title and Icon)
export default function EventTitle({ title, showIcon = false }: EventTitleProps) {
  return (
    <View style={styles.container}>
      {showIcon && <Number24Icon size={ICON_SIZE} />}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ICON_GAP,
  },
  // TODO: TDS 타이포그래피 토큰 없음 (Figma 17 / 500 / 20 / -0.2, body.large는 행간 26)
  title: {
    flex: 1,
    fontFamily: fontFamily.default,
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: -0.2,
    color: colors.text.default,
  },
});

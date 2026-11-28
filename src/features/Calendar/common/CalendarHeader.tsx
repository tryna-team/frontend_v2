import { StyleSheet, View } from 'react-native';

import { tempDesignValues } from '@/theme/tempDesignValues';
import DateTitle from './DateTitle';
import WeekHeader from './WeekHeader';
import type { CalendarHeaderProps } from '../CalendarType';

// # 상수 영역
const { calendarHeader } = tempDesignValues;

// # Main component
// Figma Calender Header의 Toolbar 아래 내용. Layout의 headerAccessory로 넘긴다
// 배경(블러, 흰색 40%, 하단 구분선)과 상태바·Toolbar 영역은 Layout의 Header가 그린다
// Calender=Monthly는 월 제목과 요일 줄, Calender=Yearly는 내용 없이 여백만 있다. 주간 변형은 해당 화면 작업 때 추가
export default function CalendarHeader(props: CalendarHeaderProps) {
  if (props.calendar === 'yearly') {
    return <View style={styles.yearly} />;
  }

  return (
    <View style={styles.container}>
      {/* Figma의 모든 월간 화면에서 기본색이다 (오늘이 속한 달이어도 강조하지 않는다) */}
      <View style={styles.title} accessibilityRole="header">
        <DateTitle title={`${props.month}월`} size="large" />
      </View>
      <WeekHeader />
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    paddingTop: calendarHeader.paddingTop,
    gap: calendarHeader.gap,
  },
  title: {
    paddingHorizontal: calendarHeader.titlePaddingHorizontal,
  },
  // Header 전체 높이를 Figma Home/Yearly(116)에 맞추는 Toolbar 아래 여백
  yearly: {
    height: calendarHeader.yearlyHeight,
  },
});

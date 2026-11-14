import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { tempDesignValues } from '@/theme/tempDesignValues';
import DayBlock from './DayBlock';
import { getWeekEventLayout } from '../utils/eventLayout';
import type { WeekBodyProps } from '../CalendarType';

// # 상수 영역
const DAYS_IN_WEEK = 7;
const { weekBody } = tempDesignValues;

// # Main component
// Figma Week Body. 한 주를 7칸으로 나누고 날짜가 있는 칸에만 Day Block을 둔다.
// 첫 날의 요일 칸부터 채우므로 첫 주는 오른쪽, 마지막 주는 왼쪽에 붙는다
function WeekBody({
  week,
  viewMode,
  today,
  selectedDate,
  eventDaysByDate,
  onSelectDate,
}: WeekBodyProps) {
  const { days } = week;
  const emptyColumnsBefore = days[0].dayOfWeek;
  const emptyColumnsAfter = DAYS_IN_WEEK - 1 - days[days.length - 1].dayOfWeek;
  // 날짜 키의 'YYYY-MM' 부분이 같으면 오늘이 속한 달이다
  const isCurrentMonth = today.slice(0, 7) === days[0].date.slice(0, 7);
  // 여러 날 일정이 칸끼리 같은 줄에 놓이도록 주 단위로 한 번에 배정한다.
  // React Compiler가 week, eventDaysByDate, viewMode가 바뀔 때만 다시 계산하므로 날짜를 선택해도 칸은 다시 그려지지 않는다
  const eventLayouts = eventDaysByDate
    ? getWeekEventLayout(week, eventDaysByDate, viewMode)
    : undefined;

  return (
    <View style={styles.container}>
      {emptyColumnsBefore > 0 && <View style={{ flex: emptyColumnsBefore }} />}

      {days.map((day) => (
        <DayBlock
          key={day.date}
          day={day}
          viewMode={viewMode}
          isToday={day.date === today}
          isSelected={day.date === selectedDate}
          isCurrentMonth={isCurrentMonth}
          eventLayout={eventLayouts?.[day.date]}
          onSelectDate={onSelectDate}
        />
      ))}

      {emptyColumnsAfter > 0 && <View style={{ flex: emptyColumnsAfter }} />}
    </View>
  );
}

export default memo(WeekBody);

// # 스타일 영역
const styles = StyleSheet.create({
  // 1일 칸만 월 제목만큼 높으므로, 아래쪽에 맞춰 칸마다 구분선 높이를 같게 한다
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: weekBody.paddingTop,
    paddingBottom: weekBody.paddingBottom,
  },
});

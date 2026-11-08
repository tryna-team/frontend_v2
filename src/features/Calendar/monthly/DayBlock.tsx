import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';
import { tempDesignValues } from '@/theme/tempDesignValues';
import CalendarDay from '../common/CalendarDay';
import DateTitle from '../common/DateTitle';
import Events from './Events';
import { WEEKDAY_NAMES } from '../utils/monthGrid';
import type { CalendarDate, DayBlockProps } from '../CalendarType';

// # 상수 영역
const { dayBlock } = tempDesignValues;

// # 함수 영역
// ## 스크린 리더가 읽을 날짜, 오늘 여부, 일정 수 (숨긴 일정도 센다)
function getAccessibilityLabel(
  { year, month, day, dayOfWeek }: CalendarDate,
  isToday: boolean,
  eventCount: number,
) {
  const labels = [`${year}년 ${month}월 ${day}일 ${WEEKDAY_NAMES[dayOfWeek]}요일`];
  if (isToday) labels.push('오늘');
  if (eventCount > 0) labels.push(`일정 ${eventCount}개`);
  return labels.join(', ');
}

// # Main component
// Figma Day Block. 칸 전체를 누르면 그 날짜를 선택한다
function DayBlock({
  day,
  viewMode,
  isToday,
  isSelected,
  isCurrentMonth,
  eventLayout,
  onSelectDate,
}: DayBlockProps) {
  return (
    <Pressable
      onPress={() => onSelectDate?.(day.date)}
      disabled={!onSelectDate}
      accessibilityRole="button"
      accessibilityLabel={getAccessibilityLabel(day, isToday, eventLayout?.eventCount ?? 0)}
      accessibilityState={{ selected: isSelected, disabled: !onSelectDate }}
      style={styles.container}
    >
      {day.isFirstDay && <DateTitle title={`${day.month}월`} isToday={isCurrentMonth} />}

      <View style={[styles.content, { height: dayBlock.contentHeight[viewMode] }]}>
        <View style={styles.divider} />
        <CalendarDay
          day={day.day}
          dayOfWeek={day.dayOfWeek}
          isToday={isToday}
          isSelected={isSelected}
        />
        {eventLayout && <Events slots={eventLayout.slots} />}
      </View>
    </Pressable>
  );
}

// React Compiler는 map으로 만든 항목을 하나씩 memo하지 않는다. 선택 날짜가 바뀌면 바뀐 칸만 다시 그리도록 감싼다
export default memo(DayBlock);

// # 스타일 영역
const styles = StyleSheet.create({
  // Week Body가 7칸으로 나눈 폭을 채운다
  container: {
    flex: 1,
    alignItems: 'center',
    gap: dayBlock.titleGap,
  },
  content: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: dayBlock.contentGap,
    paddingTop: dayBlock.contentPaddingTop,
    paddingBottom: dayBlock.contentPaddingBottom,
  },
  // Figma는 바깥쪽 선이라 칸 높이에 포함되지 않는다. border는 내용을 아래로 밀어내므로 칸 위쪽 바깥에 겹쳐 그린다
  divider: {
    position: 'absolute',
    top: -dayBlock.dividerWidth,
    left: 0,
    right: 0,
    height: dayBlock.dividerWidth,
    backgroundColor: colors.divider.default,
  },
});

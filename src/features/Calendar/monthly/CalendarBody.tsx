import { memo } from 'react';
import { View } from 'react-native';

import WeekBody from './WeekBody';
import { groupEventDaysByDate } from '../utils/eventLayout';
import { getMonthWeeks } from '../utils/monthGrid';
import type { CalendarBodyProps } from '../CalendarType';

// # Main component
// Figma Calender Body. 한 달의 Week Body를 간격 없이 쌓는다 (달 사이 간격은 월 목록에서 둔다)
function CalendarBody({
  year,
  month,
  viewMode,
  monthlyEventDays,
  today,
  selectedDate,
  onSelectDate,
}: CalendarBodyProps) {
  // React Compiler가 year, month, monthlyEventDays가 바뀔 때만 다시 계산한다
  const weeks = getMonthWeeks(year, month);
  const eventDaysByDate = monthlyEventDays ? groupEventDaysByDate(monthlyEventDays) : undefined;

  return (
    <View>
      {weeks.map((week) => (
        <WeekBody
          key={week.weekIndex}
          week={week}
          viewMode={viewMode}
          today={today}
          selectedDate={selectedDate}
          eventDaysByDate={eventDaysByDate}
          onSelectDate={onSelectDate}
        />
      ))}
    </View>
  );
}

// 월 목록의 항목으로 쓰므로, 다른 달의 선택 날짜가 바뀔 때 다시 그리지 않도록 감싼다
export default memo(CalendarBody);

import { Pressable, StyleSheet, View } from 'react-native';

import { tempDesignValues } from '@/theme/tempDesignValues';
import CalendarDay from '../common/CalendarDay';
import DateTitle from '../common/DateTitle';
import { getMonthWeeks } from '../utils/monthGrid';
import { YEAR_MONTH_BODY_HEIGHT, YEAR_MONTH_WIDTH } from '../utils/yearGrid';
import type { CalendarWeek, YearMonthProps } from '../CalendarType';

// # 상수 영역
const DAYS_IN_WEEK = 7;
const { calendarDay, yearMonth } = tempDesignValues;

// # 함수 영역
// ## 한 주의 날짜를 요일 칸(일~토)에 놓는다. 그 달의 날짜가 없는 칸은 undefined로 비워 둔다
// 첫 주는 오른쪽, 마지막 주는 왼쪽에 붙고, 주마다 칸이 7개라 달 폭이 줄어도 세로줄이 맞는다
function getWeekColumns({ days }: CalendarWeek) {
  return Array.from({ length: DAYS_IN_WEEK }, (_, dayOfWeek) =>
    days.find((day) => day.dayOfWeek === dayOfWeek),
  );
}

// # Main component
// Figma YearCalender - Monthly. 연간 캘린더의 월 캘린더로, 월 제목 아래에 그 달의 날짜를 주마다 한 줄씩 놓는다.
// 달 전체를 누른다 (날짜 칸은 따로 누르지 않는다)
export default function YearMonth({ year, month, today, onPress }: YearMonthProps) {
  const weeks = getMonthWeeks(year, month);
  const [todayYear, todayMonth] = today.split('-').map(Number);
  const isCurrentMonth = todayYear === year && todayMonth === month;

  return (
    <Pressable
      onPress={() => onPress?.(year, month)}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`${year}년 ${month}월`}
      accessibilityState={{ disabled: !onPress }}
      style={styles.container}
    >
      <View style={styles.title}>
        <DateTitle title={`${month}월`} isToday={isCurrentMonth} />
      </View>

      <View style={styles.body}>
        {weeks.map((week) => (
          <View key={week.weekIndex} style={styles.week}>
            {getWeekColumns(week).map((day, dayOfWeek) => (
              <View key={dayOfWeek} style={styles.column}>
                {day && (
                  <CalendarDay calendar="yearly" day={day.day} isToday={day.date === today} />
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </Pressable>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  // 402 폭에서 Figma와 같은 111. 화면이 좁으면 한 줄에 세 달이 들어가도록 칸과 함께 줄어든다
  container: {
    width: YEAR_MONTH_WIDTH,
    flexShrink: 1,
    gap: yearMonth.titleGap,
  },
  // TODO: 디자이너 확인 이후 수정 필요. 월 제목 영역을 모든 달 22로 맞추고, 제목(_Title Small)을 가운데에 놓는다
  title: {
    height: yearMonth.titleHeight,
    justifyContent: 'center',
  },
  // TODO: 디자이너 확인 이후 수정 필요. 주 수와 관계없이 6주 높이로 고정해 주가 적은 달은 아래가 빈다
  body: {
    height: YEAR_MONTH_BODY_HEIGHT,
    gap: yearMonth.weekGap,
  },
  week: {
    flexDirection: 'row',
    gap: yearMonth.dayGap,
  },
  // 달 폭을 7칸으로 나눈다 (402 폭에서 Figma와 같은 15)
  column: {
    flex: 1,
    height: calendarDay.yearlySize,
    alignItems: 'center',
  },
});

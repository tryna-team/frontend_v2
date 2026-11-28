import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';
import { tempDesignValues } from '@/theme/tempDesignValues';
import DateTitle from '../common/DateTitle';
import YearMonth from './YearMonth';
import { MONTH_ROWS } from '../utils/yearGrid';
import type { YearSectionProps } from '../CalendarType';

// # 상수 영역
const { yearSection } = tempDesignValues;

// # Main component
// Figma Calender Layer. 연간 캘린더의 한 해로, 연도 제목 아래에 월 캘린더(YearMonth) 12개를 한 줄에 세 달씩 놓는다.
// 배치만 맡고, 달 안의 내용은 YearMonth가 그린다
export default function YearSection({ year, today, onPressMonth }: YearSectionProps) {
  const [todayYear] = today.split('-').map(Number);

  return (
    <View>
      {/* Figma YearCalender - Header. 페이지의 연도 제목 높이가 해마다 32·43으로 달라 32(_Title Large)로 고정한다 */}
      <View style={styles.header} accessibilityRole="header">
        <DateTitle title={`${year}년`} size="large" isToday={todayYear === year} />
      </View>

      {/* Figma YearCalender - Body */}
      <View style={styles.body}>
        <View style={styles.divider} />
        {MONTH_ROWS.map((months) => (
          <View key={months[0]} style={styles.row}>
            {months.map((month) => (
              <YearMonth
                key={month}
                year={year}
                month={month}
                today={today}
                onPress={onPressMonth}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  header: {
    paddingVertical: yearSection.headerPaddingVertical,
    paddingHorizontal: yearSection.headerPaddingHorizontal,
  },
  body: {
    paddingTop: yearSection.bodyPaddingTop,
    gap: yearSection.rowGap,
  },
  // Figma는 Body 위쪽 바깥 선이라 높이에 포함되지 않는다. 연도 제목 줄 맨 아래 1px에 겹쳐 그린다
  divider: {
    position: 'absolute',
    top: -yearSection.dividerWidth,
    left: 0,
    right: 0,
    height: yearSection.dividerWidth,
    backgroundColor: colors.divider.default,
  },
  // 세 달을 양 끝에 붙이고 남는 폭을 달 사이에 나눈다 (402 폭에서 Figma와 같은 10.5)
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: yearSection.monthGap,
    paddingHorizontal: yearSection.rowPaddingHorizontal,
  },
});

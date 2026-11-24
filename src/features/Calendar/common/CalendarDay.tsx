import { StyleSheet, Text, View } from 'react-native';

import { colors, palette } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { tempDesignValues } from '@/theme/tempDesignValues';
import { typography } from '@/theme/typography';
import { WEEKDAY_NAMES } from '../utils/monthGrid';
import type { CalendarDayProps } from '../CalendarType';

// # 타입 영역
type DayState = {
  isWeekend: boolean;
  isToday: boolean;
  isSelected: boolean;
};

// # 함수 영역
// ## 일요일(0)과 토요일(6)
function isWeekendDay(dayOfWeek: number) {
  return dayOfWeek === 0 || dayOfWeek === 6;
}

// ## 숫자의 상태별 색: 선택 → 오늘 → 주말 → 평일 순으로 정한다
function getDayColors({ isWeekend, isToday, isSelected }: DayState) {
  if (isSelected) {
    return {
      background: isToday ? palette.apricot[300] : palette.greyOpacity[800],
      text: colors.text.white,
    };
  }

  if (isToday) return { background: undefined, text: palette.apricot[400] };

  return { background: undefined, text: isWeekend ? colors.text.additional : colors.text.default };
}

// # Main component
// Figma _Day. Calender=Montly의 Label Style=Num only(날짜 숫자)·Week only(요일 글자)와
// Calender=Yearly의 Num only(연간 캘린더의 작은 날짜 숫자)를 그린다. 주간 변형은 해당 화면 작업 때 추가
export default function CalendarDay(props: CalendarDayProps) {
  // 요일 글자는 오늘·선택과 관계없이 주말만 구분한다 (Figma Week only 변형이 모두 같은 색)
  if (props.labelStyle === 'weekOnly') {
    return (
      <View style={styles.weekLabel}>
        <Text
          style={[
            styles.weekText,
            { color: isWeekendDay(props.dayOfWeek) ? colors.text.additional : colors.text.default },
          ]}
        >
          {WEEKDAY_NAMES[props.dayOfWeek]}
        </Text>
      </View>
    );
  }

  // 연간 칸은 오늘만 원을 채워 표시한다.
  // Figma _Day에는 연간 주말(Day=Weekend)·선택(Select=True) 변형도 있지만 Home/Yearly에서 쓰지 않아 그리지 않는다
  if (props.calendar === 'yearly') {
    const { day, isToday } = props;

    return (
      <View style={[styles.yearlyNumLabel, isToday && styles.yearlyToday]}>
        <Text
          style={[styles.yearlyText, { color: isToday ? colors.text.white : colors.text.default }]}
        >
          {day}
        </Text>
      </View>
    );
  }

  const { day, dayOfWeek, isToday, isSelected } = props;
  const { background, text } = getDayColors({
    isWeekend: isWeekendDay(dayOfWeek),
    isToday,
    isSelected,
  });

  return (
    <View style={[styles.numLabel, background && { backgroundColor: background }]}>
      <Text style={[isSelected ? styles.selectedText : styles.text, { color: text }]}>{day}</Text>
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  numLabel: {
    width: tempDesignValues.calendarDay.size,
    height: tempDesignValues.calendarDay.size,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  // Figma TDS/Body/Body (17/20, 400)
  text: {
    ...typography.default.body.large,
  },
  // Figma TDS/Body/Body Emphasized (17/20, 600)
  selectedText: {
    ...typography.default.bodyStrong.large,
  },
  // 글자 행간(18)이 틀 높이(14)보다 커서 위아래로 넘치지만, Figma 높이를 지키고 가운데에 놓는다
  weekLabel: {
    height: tempDesignValues.calendarDay.weekLabelHeight,
    justifyContent: 'center',
  },
  // Figma TDS/Caption/Caption1 (12/14, 500)
  weekText: {
    ...typography.default.label.medium,
  },
  // Figma _Day (Calender=Yearly)
  yearlyNumLabel: {
    width: tempDesignValues.calendarDay.yearlySize,
    height: tempDesignValues.calendarDay.yearlySize,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  // Figma Today=True: apricot-300 원에 흰 글자
  yearlyToday: {
    backgroundColor: palette.apricot[300],
  },
  // Figma TDS/Caption/Caption2 (11/13, 500)
  yearlyText: {
    ...typography.default.caption.large,
  },
});

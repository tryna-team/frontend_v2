import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, palette } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { fontFamily } from '@/theme/typography';

// # 상수 영역
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// # 타입 영역
type DatePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
  selectedColor?: string;
};

type TitleProps = {
  date: Date;
  onPrevious: () => void;
  onNext: () => void;
};

type WeekHeaderProps = {
  date: Date;
  selectedColor: string;
};

// # 유틸 함수
function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// # Title
function Title({ date, onPrevious, onNext }: TitleProps) {
  const dateText = `${date.getMonth() + 1}월 ${date.getDate()}일 ${WEEKDAYS[date.getDay()]}요일`;

  return (
    <View style={styles.title}>
      <Text style={styles.titleText}>{dateText}</Text>

      <View style={styles.navigation}>
        <Pressable
          onPress={onPrevious}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="이전 주"
        >
          <ChevronLeft size={24} color={colors.icon.default} />
        </Pressable>

        <Pressable
          onPress={onNext}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="다음 주"
        >
          <ChevronRight size={24} color={colors.icon.default} />
        </Pressable>
      </View>
    </View>
  );
}

// # WeekHeader
function WeekHeader({ date, selectedColor }: WeekHeaderProps) {
  const startOfWeek = addDays(date, -date.getDay());

  return (
    <View style={styles.weekHeader}>
      {WEEKDAYS.map((weekday, index) => {
        const day = addDays(startOfWeek, index);
        const selected = isSameDate(day, date);
        const weekend = index === 0 || index === 6;

        return (
          <View key={weekday} style={styles.day}>
            {/* Week */}
            <Text
              style={[
                styles.weekText,
                weekend && styles.weekendText,
              ]}
            >
              {weekday}
            </Text>

            {/* DateNumber */}
            <View style={styles.dateNumber}>
              <Text
                style={[
                  styles.numberText,
                  weekend && styles.weekendText,
                  selected && styles.selectedText,
                  selected && { backgroundColor: selectedColor },
                ]}
              >
                {day.getDate()}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

// # Main component
export default function DatePicker({
  value,
  onChange,
  selectedColor = palette.apricot[300],
}: DatePickerProps) {
  const handleWeekChange = (weeks: number) => {
    onChange(addDays(value, weeks * 7));
  };

  return (
    <View style={styles.container}>
      <Title
        date={value}
        onPrevious={() => handleWeekChange(-1)}
        onNext={() => handleWeekChange(1)}
      />

      <WeekHeader
        date={value}
        selectedColor={selectedColor}
      />
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
  },

  // ## Title
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleText: {
    // TODO: 추후 TDS Label1 타이포그래피 적용
    fontFamily: fontFamily.default,
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: -0.2,
    color: colors.text.default,
    includeFontPadding: false,
  },

  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },

  // ## WeekHeader
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  day: {
    width: 34,
    alignItems: 'center',
    gap: 0,
  },

  weekText: {
    // TODO: 추후 TDS Caption1 타이포그래피 적용
    fontFamily: fontFamily.default,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 14,
    letterSpacing: 0,
    color: colors.text.default,
    textAlign: 'center',
    includeFontPadding: false,
  },

  dateNumber: {
    height: 42,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  numberText: {
    // TODO: 추후 TDS Body 타이포그래피 적용
    width: 34,
    height: 34,
    borderRadius: radius.full,
    overflow: 'hidden',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: fontFamily.default,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.2,
    color: colors.text.default,
    includeFontPadding: false,
  },

  weekendText: {
    color: colors.text.additional,
  },

  selectedText: {
    // TODO: 추후 TDS Body Emphasized 타이포그래피 적용
    fontWeight: '600',
    color: colors.text.white,
  },
});
import { Pressable, StyleSheet, View } from 'react-native';

import Button from '@/components/Button/Button';
import ApproximatelyIcon from '@/components/Icon/Approximately';

import Date from './Date';

// # 타입 영역
export type SelectedPeriod = 'start' | 'end' | null;

type PeriodProps = {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  selectedPeriod: SelectedPeriod;
  isAllDay: boolean;
  onPeriodPress: (period: 'start' | 'end') => void;
  onAllDayChange: (value: boolean) => void;
};

// # Main component
export default function Period({
  startDate,
  startTime,
  endDate,
  endTime,
  selectedPeriod,
  isAllDay,
  onPeriodPress,
  onAllDayChange,
}: PeriodProps) {
  const dateVariant = isAllDay ? 'date' : 'dateTime';

  return (
    <View style={styles.container}>
      {/* Leading */}
      <View style={styles.leading}>
        {/* 시작 날짜 */}
        <Pressable
          onPress={() => onPeriodPress('start')}
          accessibilityRole="button"
          accessibilityLabel="시작 날짜 선택"
          accessibilityState={{
            selected: selectedPeriod === 'start',
          }}
        >
          <Date
            variant={dateVariant}
            status={
              selectedPeriod === 'start'
                ? 'selected'
                : 'enable'
            }
            date={startDate}
            time={startTime}
          />
        </Pressable>

        {/* 구분 아이콘 */}
        <ApproximatelyIcon size={24} />

        {/* 종료 날짜 */}
        <Pressable
          onPress={() => onPeriodPress('end')}
          accessibilityRole="button"
          accessibilityLabel="종료 날짜 선택"
          accessibilityState={{
            selected: selectedPeriod === 'end',
          }}
        >
          <Date
            variant={dateVariant}
            status={
              selectedPeriod === 'end'
                ? 'selected'
                : 'enable'
            }
            date={endDate}
            time={endTime}
          />
        </Pressable>
      </View>

      {/* Trailing */}
      <View style={styles.trailing}>
        <Pressable
          onPress={() => onAllDayChange(!isAllDay)}
          accessibilityRole="switch"
          accessibilityLabel="하루종일"
          accessibilityState={{ checked: isAllDay }}
        >
          <View pointerEvents="none">
            <Button
              size="small"
              appearance="bordered"
              label="하루종일"
              disabled={!isAllDay}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  leading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  trailing: {
    marginLeft: 'auto',
  },
});
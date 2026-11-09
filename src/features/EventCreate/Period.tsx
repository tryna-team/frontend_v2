import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import Button from '@/components/Button/Button';
import ApproximatelyIcon from '@/components/Icon/Approximately';

import Date from './Date';

// # 타입 영역
type SelectedDate = 'start' | 'end' | null;

type PeriodProps = {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

// # Main component
export default function Period({
  startDate,
  startTime,
  endDate,
  endTime,
}: PeriodProps) {
  const [selectedDate, setSelectedDate] = useState<SelectedDate>(null);
  const [isAllDay, setIsAllDay] = useState(false);

  const dateVariant = isAllDay ? 'date' : 'dateTime';

  return (
    <View style={styles.container}>
      {/* Leading */}
      <View style={styles.leading}>
        {/* 시작 날짜 */}
        <Pressable
          onPress={() => setSelectedDate('start')}
          accessibilityRole="button"
          accessibilityLabel="시작 날짜 선택"
          accessibilityState={{ selected: selectedDate === 'start' }}
        >
          <Date
            variant={dateVariant}
            status={selectedDate === 'start' ? 'selected' : 'enable'}
            date={startDate}
            time={startTime}
          />
        </Pressable>

        {/* 구분 아이콘 */}
        <ApproximatelyIcon size={24} />

        {/* 종료 날짜 */}
        <Pressable
          onPress={() => setSelectedDate('end')}
          accessibilityRole="button"
          accessibilityLabel="종료 날짜 선택"
          accessibilityState={{ selected: selectedDate === 'end' }}
        >
          <Date
            variant={dateVariant}
            status={selectedDate === 'end' ? 'selected' : 'enable'}
            date={endDate}
            time={endTime}
          />
        </Pressable>
      </View>

      {/* Trailing */}
      <View style={styles.trailing}>
        <Pressable
          onPress={() => setIsAllDay((previous) => !previous)}
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
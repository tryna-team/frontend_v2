
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
            variant="dateTime"
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
            variant="dateTime"
            status={selectedDate === 'end' ? 'selected' : 'enable'}
            date={endDate}
            time={endTime}
          />
        </Pressable>
      </View>

      {/* Trailing */}
      <View style={styles.trailing}>
        {/* TODO: 하루종일 버튼 클릭 시 동작 확정 후 구현 */}
        <Button
          size="small"
          appearance="bordered"
          label="하루종일"
          disabled
        />
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

import { StyleSheet, View } from 'react-native';

import DatePicker from './DatePicker';
import TimePicker, { type TimePickerValue } from './TimePicker';

import { colors } from '@/theme/colors';

// # 타입 영역
type PickerProps = {
  variant?: 'dateTime' | 'date';
  date: Date;
  onDateChange: (date: Date) => void;
  time?: TimePickerValue;
  onTimeChange?: (time: TimePickerValue) => void;
  selectedColor?: string;
};

// # Main component
export default function Picker({
  variant = 'dateTime',
  date,
  onDateChange,
  time,
  onTimeChange,
  selectedColor,
}: PickerProps) {
  const showTime = variant === 'dateTime';

  return (
    <View style={styles.container}>
      {/* DatePicker */}
      <DatePicker
        value={date}
        onChange={onDateChange}
        selectedColor={selectedColor}
      />

      {/* TimePicker */}
      {showTime && time && onTimeChange && (
        <>
          <View style={styles.separator} />

          <TimePicker
            value={time}
            onChange={onTimeChange}
          />
        </>
      )}
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    gap: 16,
    backgroundColor: colors.background.white,
  },

  separator: {
    height: 1,
    width: '100%',
    backgroundColor: colors.divider.default,
  },
});
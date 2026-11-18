import { StyleSheet, Text, View } from 'react-native';

import { colors, palette } from '@/theme/colors';

// # 타입 영역
type DateStatus = 'enable' | 'disable' | 'selected';

type DateProps = {
  variant: 'date' | 'dateTime';
  status: 'enable' | 'selected';
  date: string;
  time: string;
};

// # 상수 영역
const STATUS_COLORS = {
  enable: colors.text.default,
  disable: colors.text.disable,
  selected: palette.apricot[400],
} as const;

// # Main component
export default function Date({
  variant,
  status = 'enable',
  date,
  time,
}: DateProps) {
  const textColor = STATUS_COLORS[status];

  if (variant === 'date') {
    return (
      <Text style={[styles.dateOnly, { color: textColor }]}>
        {date}
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.dateTimeDate, { color: textColor }]}>
        {date}
      </Text>
      <Text style={[styles.dateTimeTime, { color: textColor }]}>
        {time}
      </Text>
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 2,
  },

  // TODO: TDS/Subheadline/Subheadline 토큰 적용 시 교체
  dateTimeDate: {
    fontFamily: 'Wanted Sans',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: -0.2,
  },

  // TODO: TDS/Title/Title3 Emphasized 토큰 적용 시 교체
  dateTimeTime: {
    fontFamily: 'Wanted Sans',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.4,
  },

  // TODO: TDS/Headline/Headline Emphasized 토큰 적용 시 교체
  dateOnly: {
    fontFamily: 'Wanted Sans',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
});

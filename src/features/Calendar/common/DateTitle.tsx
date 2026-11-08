import { StyleSheet, Text, View } from 'react-native';

import { colors, palette } from '@/theme/colors';
import { tempDesignValues } from '@/theme/tempDesignValues';
import { typography } from '@/theme/typography';
import type { DateTitleProps } from '../CalendarType';

// # Main component
// Figma _Title (Date=Month). Small은 Day Block의 1일 칸, Large는 Calender Header의 월 제목이다
// Week·Year, Is Disable 변형은 해당 화면 작업 때 추가
export default function DateTitle({ title, size = 'small', isToday = false }: DateTitleProps) {
  const isLarge = size === 'large';

  return (
    <View style={isLarge ? styles.largeContainer : styles.smallContainer}>
      <Text
        style={[
          isLarge ? styles.largeText : styles.smallText,
          { color: isToday ? palette.apricot[400] : colors.text.default },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

// # 스타일 영역
// 글자 행간이 틀 높이보다 커서 위아래로 넘치지만, Figma도 높이를 고정하고 글자를 가운데에 겹쳐 그린다
const styles = StyleSheet.create({
  smallContainer: {
    height: tempDesignValues.dateTitle.smallHeight,
    justifyContent: 'center',
  },
  largeContainer: {
    height: tempDesignValues.dateTitle.largeHeight,
    justifyContent: 'center',
  },
  // Figma TDS/Title/Title3 Emphasized (20/22, 600)
  smallText: {
    ...typography.default.titleStrong.large,
  },
  // Figma TDS/Display/Display Emphasized (36/43, 600)
  largeText: {
    ...typography.default.display,
  },
});

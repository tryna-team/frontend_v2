import { Pressable, StyleSheet, Text } from 'react-native';

import CircleIcon from '@/components/Icon/Circle';
import ListItemLayout from '@/components/List/ListItemLayout';
import { colors } from '@/theme/colors';
import { fontFamily } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

import type { EventListItemProps } from './EventType';

// # 임시 디자인 수치
// TODO: TDS 토큰 정해지면 교체 (tempDesignValues.ts 머지 후 이동)
const ICON_SIZE = 14;

// # Main component
// Figma _List: 원 + Label (+ 날짜·시간). selection이면 완료 상태로 흐리게 표시
// 레이아웃은 공용 ListItemLayout 사용
// TODO: Label ~ 날짜 간격이 ListItemLayout 기준 4 (Figma 8). ListItemLayout TODO 정리 시 같이 확인
// TODO: EventCreate TodoList와 구조가 겹침 → components/List로 분리할지 논의
export default function EventListItem({
  label,
  selection = false,
  date,
  time,
  onPress,
  onLongPress,
}: EventListItemProps) {
  const color = selection ? colors.text.disable : colors.text.default;

  return (
    <Pressable
      onPress={onPress}
      // 항목이 터치를 가져가므로 Event의 길게 누르기를 그대로 받는다
      onLongPress={onLongPress}
      disabled={!onPress && !onLongPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selection }}
    >
      <ListItemLayout
        leading={
          <CircleIcon
            size={ICON_SIZE}
            dot={selection}
            color={selection ? colors.icon.disable : colors.icon.default}
          />
        }
        middle={
          <Text numberOfLines={1} style={[styles.label, { color }]}>
            {label}
          </Text>
        }
        date={date}
        time={time}
        gap={spacing.gap.small}
        trailingStyle={[styles.trailing, { color }]}
      />
    </Pressable>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  // TODO: TDS 타이포그래피 토큰 없음 (Figma 15 / 400 / 18 / -0.2)
  label: {
    fontFamily: fontFamily.default,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: -0.2,
  },
  // TODO: TDS 타이포그래피 토큰 없음 (Figma 12 / 500 / 14, label.medium은 행간 18)
  trailing: {
    fontFamily: fontFamily.default,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 14,
  },
});

import { Pressable, StyleSheet, View } from 'react-native';

import { colors, palette } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

import EventDivider from './EventDivider';
import EventList from './EventList';
import EventMeta from './EventMeta';
import EventTitle from './EventTitle';
import type { EventProps } from './EventType';

// # 임시 디자인 수치
// TODO: TDS 토큰 정해지면 교체 (tempDesignValues.ts 머지 후 이동)
const BORDERED_RADIUS = 16; // radius 토큰은 8 / 24만 있음
const CONTENT_GAP_DEFAULT = 10;

// # Main component
// Figma Event: Event Style(title·items 유무) × Style(variant)
// 구성: [_Meta 시간] [_Divider 세로 바] [_Title 제목 + Lists 항목]
//
// 사용 예)
// <Event
//   variant="bordered"                                   // 카드형. 구분선형은 'borderless'
//   meta={{ state: 'startToEnd', startTime: '05:00', endTime: '11:00' }}
//   title={{ title: '팀플 회의' }}
//   items={[{ id: '10', label: '자료 출력', selection: false, onPress: toggleItem }]}
//   onPress={openEventDetail}                            // 항목에 onPress가 없으면 이걸로 대신
//   onLongPress={(e) => openMenu(e?.nativeEvent.pageY)}  // 삭제·복제 메뉴는 페이지에서
// />
//
// API 연결 시: 시간·날짜는 화면에 보일 문자열로 바꿔서 넘긴다 (예: displayTime → '09:00')
// 표시 전용 컴포넌트라 API 호출·상태 관리는 하지 않는다
export default function Event({
  variant = 'bordered',
  meta,
  title,
  items,
  onPress,
  onLongPress,
}: EventProps) {
  const hasTitle = title != null;
  const hasList = items != null && items.length > 0;
  // Title and List만 위 정렬, 나머지(Title only / List only)는 세로 가운데 정렬
  const isTitleAndList = hasTitle && hasList;

  const row = (
    <View style={[styles.row, isTitleAndList ? styles.alignTop : styles.alignCenter]}>
      <EventMeta {...meta} />
      <EventDivider />
      <View
        style={[styles.content, { gap: isTitleAndList ? spacing.gap.large : CONTENT_GAP_DEFAULT }]}
      >
        {hasTitle && <EventTitle {...title} />}
        {hasList && <EventList items={items} onEventPress={onPress} onLongPress={onLongPress} />}
      </View>
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      // onLongPress만 넘겨도 눌리도록 둘 다 없을 때만 비활성화
      disabled={!onPress && !onLongPress}
      accessibilityRole={onPress ? 'button' : undefined}
      // 스크린 리더는 길게 누르기가 어려워서 "메뉴 열기" 동작으로 노출
      accessibilityActions={onLongPress ? [{ name: 'longpress', label: '메뉴 열기' }] : undefined}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === 'longpress') onLongPress?.();
      }}
      style={variant === 'bordered' ? styles.bordered : styles.borderless}
    >
      {variant === 'bordered' ? (
        row
      ) : (
        <>
          <View style={styles.borderlessRow}>{row}</View>
          <View style={styles.separator} />
        </>
      )}
    </Pressable>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.gap.medium,
  },
  alignTop: {
    alignItems: 'flex-start',
  },
  alignCenter: {
    alignItems: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },

  // ## Style=Bordered
  bordered: {
    padding: spacing.padding.medium,
    borderRadius: BORDERED_RADIUS,
    // TODO: 카드 배경 Semantic 토큰 없음 (Figma #fafafb = grey 50)
    backgroundColor: palette.grey[50],
  },

  // ## Style=Borderless
  borderless: {
    gap: spacing.gap.medium,
  },
  borderlessRow: {
    paddingHorizontal: spacing.padding.xsmall,
  },
  separator: {
    height: 1,
    backgroundColor: colors.divider.default,
  },
});

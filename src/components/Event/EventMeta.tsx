import { StyleSheet, Text, View } from 'react-native';
import { ArrowUpRight } from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { fontFamily } from '@/theme/typography';

import type { EventMetaProps } from './EventType';

// # 임시 디자인 수치
// TODO: TDS 토큰 정해지면 교체 (tempDesignValues.ts 머지 후 이동)
const META_WIDTH = 56;
const META_GAP = 2;
const LINKED_ICON_SIZE = 24;
const LINKED_ICON_STROKE = 1.8;

// # Main component
// Figma _Meta: Event 왼쪽 시간 영역 (폭 고정 56). state별 표시는 EventType 참고
export default function EventMeta(props: EventMetaProps) {
  return (
    <View style={styles.container}>
      {props.state === 'allday' && <Text style={styles.allday}>하루종일</Text>}

      {(props.state === 'startTime' || props.state === 'startToEnd') && (
        <Text style={styles.startTime}>{props.startTime}</Text>
      )}

      {props.state === 'startToEnd' && <Text style={styles.endTime}>{props.endTime}</Text>}

      {props.state === 'linked' && (
        <>
          <ArrowUpRight
            size={LINKED_ICON_SIZE}
            color={colors.icon.default}
            strokeWidth={LINKED_ICON_STROKE}
          />
          <Text style={styles.linked}>{props.linkedLabel}</Text>
        </>
      )}
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    width: META_WIDTH,
    gap: META_GAP,
  },
  // TODO: TDS 타이포그래피 토큰 없음 (Figma 20 / 600 / 22 / -0.4)
  startTime: {
    fontFamily: fontFamily.default,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.4,
    color: colors.text.default,
  },
  // TODO: TDS 타이포그래피 토큰 없음 (Figma 12 / 600 / 14)
  endTime: {
    fontFamily: fontFamily.default,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 14,
    color: colors.text.additional,
  },
  // TODO: TDS 타이포그래피 토큰 없음 (Figma 16 / 600 / 19 / -0.2)
  allday: {
    fontFamily: fontFamily.default,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 19,
    letterSpacing: -0.2,
    color: colors.text.default,
  },
  // TODO: TDS 타이포그래피 토큰 없음 (Figma 11 / 500 / 13 / -0.1)
  linked: {
    fontFamily: fontFamily.default,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 13,
    letterSpacing: -0.1,
    color: colors.text.default,
  },
});

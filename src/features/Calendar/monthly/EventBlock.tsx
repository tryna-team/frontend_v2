import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import Number24Icon from '@/components/Icon/24hour';
import { palette } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { tempDesignValues } from '@/theme/tempDesignValues';
import { typography } from '@/theme/typography';
import type { EventBlockColor, EventBlockEdge, EventBlockProps } from '../CalendarType';

// # 상수 영역
const { eventBlock, events } = tempDesignValues;

// 라벨별 색이 정해지기 전까지 모든 일정에 쓰는 Figma 기본색
const DEFAULT_COLOR: EventBlockColor = {
  background: palette.green[50],
  title: palette.green[800],
  time: palette.green[700],
  icon: palette.green[800],
};

// # 함수 영역
// ## 이어지는 쪽 모서리는 직각으로 하고, Figma Edge 변형처럼 둥근 쪽 여백을 넓힌다
// TODO: Figma Edge 변형은 둥근 쪽 여백이 4.71이라 제목 위치가 일반 블록과 2.71 어긋난다. 디자이너 확인 필요
function getEdgeStyle(edge: EventBlockEdge, cornerRadius: number): ViewStyle {
  const isFlatLeft = edge === 'left' || edge === 'both';
  const isFlatRight = edge === 'right' || edge === 'both';

  return {
    borderTopLeftRadius: isFlatLeft ? 0 : cornerRadius,
    borderBottomLeftRadius: isFlatLeft ? 0 : cornerRadius,
    borderTopRightRadius: isFlatRight ? 0 : cornerRadius,
    borderBottomRightRadius: isFlatRight ? 0 : cornerRadius,
    paddingLeft: edge === 'right' ? eventBlock.edgePadding : eventBlock.paddingHorizontal,
    paddingRight: edge === 'left' ? eventBlock.edgePadding : eventBlock.paddingHorizontal,
  };
}

// # Main component
// Figma _Event Block과 _Event Block - Multiple. span이 2 이상이면 오른쪽 칸 위로 넓어진다
export default function EventBlock({
  title,
  time,
  labelStyle,
  detail,
  span = 1,
  edge = 'none',
  color = DEFAULT_COLOR,
}: EventBlockProps) {
  const hasIcon = labelStyle === 'textAndIcon';
  // Figma: Text and Icon은 네 모서리 모두 999(양 끝이 반원), Text only는 4
  const cornerRadius = hasIcon ? radius.full : radius.xsmall;
  const height = eventBlock.height[detail ? 'detail' : hasIcon ? 'icon' : 'text'];

  // 칸 폭 × span에서 좌우 여백을 뺀 폭이 된다 (402 폭에서 한 칸이면 Figma와 같은 52)
  return (
    <View style={[styles.container, { width: `${span * 100}%` }]}>
      <View
        style={[
          detail ? styles.detailBlock : styles.lineBlock,
          { height, backgroundColor: color.background },
          getEdgeStyle(edge, cornerRadius),
        ]}
      >
        {detail ? (
          <>
            <View style={styles.detailTitle}>
              <Text numberOfLines={2} style={[styles.text, { color: color.title }]}>
                {title}
              </Text>
            </View>
            <View style={styles.detailTime}>
              <Text numberOfLines={1} style={[styles.text, { color: color.time }]}>
                {time}
              </Text>
            </View>
          </>
        ) : (
          <>
            {hasIcon && <Number24Icon size={eventBlock.iconSize} color={color.icon} />}
            <Text numberOfLines={1} style={[styles.text, styles.lineText, { color: color.title }]}>
              {title}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

// # 스타일 영역
// 글자는 틀 가운데에 놓는다. 토큰 행간이 Figma보다 커서 위아래로 조금 넘치지만 잘라내지 않는다
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: events.inset,
  },
  lineBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: eventBlock.paddingVertical,
  },
  detailBlock: {
    paddingVertical: eventBlock.paddingVertical,
  },
  detailTitle: {
    height: eventBlock.detailTitleHeight,
  },
  detailTime: {
    height: eventBlock.detailTimeHeight,
    justifyContent: 'center',
  },
  // Figma 제목 11/13, 600 · 시간 11/13, 500
  text: {
    ...typography.default.caption.large,
  },
  // 아이콘 옆 제목이 남은 폭 안에서 말줄임되게 한다
  lineText: {
    flexShrink: 1,
  },
});

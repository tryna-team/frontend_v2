import { useId, useRef, useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import Number24Icon from '@/components/Icon/24hour';
import { palette } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { tempDesignValues } from '@/theme/tempDesignValues';
import { typography } from '@/theme/typography';
import type { EventBlockColor, EventBlockEdge, EventBlockProps } from '../CalendarType';

// # 상수 영역
const { eventBlock, events } = tempDesignValues;
// onLayout 폭의 픽셀 반올림 오차. 제목 폭이 영역 폭과 이만큼 이내면 끝에 닿은 것으로 본다
const OVERFLOW_TOLERANCE = 0.5;

// 라벨별 색이 정해지기 전까지 모든 일정에 쓰는 Figma 기본색
const DEFAULT_COLOR: EventBlockColor = {
  background: palette.green[50],
  title: palette.green[800],
  time: palette.green[700],
  icon: palette.green[800],
};

// # 타입 영역
type FadingTitleProps = {
  title: string;
  color: EventBlockColor;
};

type FadeEdgeProps = {
  color: string; // 블록 배경색. 오른쪽으로 갈수록 이 색으로 글자를 진하게 덮는다
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

// ## 한 줄 제목이 제목 영역을 넘어 잘렸는지
// 제목 글자는 영역 폭까지만 늘어나므로, 글자 폭이 영역 폭에 닿으면 잘린 것으로 본다
function useTitleOverflow() {
  const widths = useRef({ area: 0, title: 0 });
  const [isOverflowing, setIsOverflowing] = useState(false);

  // 두 폭 중 하나가 바뀔 때마다 다시 비교한다
  const compare = () => {
    const { area, title } = widths.current;
    setIsOverflowing(area > 0 && title >= area - OVERFLOW_TOLERANCE);
  };

  return {
    isOverflowing,
    onAreaLayout: (event: LayoutChangeEvent) => {
      widths.current.area = event.nativeEvent.layout.width;
      compare();
    },
    onTitleLayout: (event: LayoutChangeEvent) => {
      widths.current.title = event.nativeEvent.layout.width;
      compare();
    },
  };
}

// ## 요약형 한 줄 제목. 넘치면 말줄임(…) 대신 잘라내고, 끝을 흐리게 덮어 뒤에 글자가 더 있음을 보여 준다
// 잘리지 않은 제목은 덮지 않는다 (끝 글자가 흐려져 잘린 것처럼 보이지 않게)
function FadingTitle({ title, color }: FadingTitleProps) {
  const { isOverflowing, onAreaLayout, onTitleLayout } = useTitleOverflow();

  return (
    <View style={styles.titleArea} onLayout={onAreaLayout}>
      <Text
        numberOfLines={1}
        ellipsizeMode="clip"
        onLayout={onTitleLayout}
        style={[styles.text, styles.lineText, { color: color.title }]}
      >
        {title}
      </Text>
      {isOverflowing && <FadeEdge color={color.background} />}
    </View>
  );
}

// ## 제목 영역 오른쪽 끝을 블록 배경색 그라데이션으로 덮는다
function FadeEdge({ color }: FadeEdgeProps) {
  // 웹은 그라데이션 id를 문서 전체에서 찾으므로, 블록마다 다른 id를 써야 다른 블록의 색을 가져오지 않는다
  const gradientId = useId();

  return (
    <View style={styles.fade}>
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={color} stopOpacity={0} />
            <Stop offset="1" stopColor={color} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
      </Svg>
    </View>
  );
}

// # Main component
// Figma _Event Block과 _Event Block - Multiple. span이 2 이상이면 오른쪽 칸 위로 넓어진다
export default function EventBlock({
  title,
  time,
  labelStyle,
  detail,
  fadeOverflow = false,
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
          fadeOverflow && styles.fadeBlock,
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
            {fadeOverflow ? (
              <FadingTitle title={title} color={color} />
            ) : (
              <Text numberOfLines={1} style={[styles.text, styles.lineText, { color: color.title }]}>
                {title}
              </Text>
            )}
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
  // 아이콘 옆 제목이 남은 폭 안에서 말줄임되거나 잘리게 한다
  lineText: {
    flexShrink: 1,
  },
  // 흐림 덮개가 둥근 모서리(아이콘 블록의 반원) 밖으로 나가지 않게 자른다
  fadeBlock: {
    overflow: 'hidden',
  },
  // 아이콘 옆 남은 폭 전체. 이 폭에 제목이 닿으면 잘린 것이다
  titleArea: {
    flex: 1,
    flexDirection: 'row',
  },
  // 제목 영역 오른쪽 끝에 겹친다. 터치는 아래 칸(Day Block)으로 넘긴다
  fade: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: eventBlock.fadeWidth,
    pointerEvents: 'none',
  },
});

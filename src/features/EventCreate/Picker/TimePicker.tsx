import { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from 'react-native';

import { colors, palette } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { fontFamily } from '@/theme/typography';

// # 상수 영역
const ITEM_HEIGHT = 27;
const PICKER_HEIGHT = ITEM_HEIGHT * 5;

const REPEAT_COUNT = 21;
const CENTER_REPEAT = Math.floor(REPEAT_COUNT / 2);

const HOURS = Array.from({ length: 24 }, (_, index) => index);
const MINUTES = Array.from({ length: 12 }, (_, index) => index * 5);

// # 타입 영역
export type TimePickerValue = {
  hour: number;
  minute: number;
};

type TimePickerProps = {
  value: TimePickerValue;
  onChange: (value: TimePickerValue) => void;
};

type WheelColumnProps = {
  values: number[];
  value: number;
  onChange: (value: number) => void;
};

// # Wheel Column
function WheelColumn({ values, value, onChange }: WheelColumnProps) {
  const scrollRef = useRef<ScrollViewInstance>(null);

  const initialIndex =
    CENTER_REPEAT * values.length +
    Math.max(values.indexOf(value), 0);

  const currentIndex = useRef(initialIndex);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const items = Array.from(
    { length: values.length * REPEAT_COUNT },
    (_, index) => values[index % values.length],
  );

  // ## 스크롤 중 중앙 항목 추적
  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const index = Math.max(
      0,
      Math.min(
        Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT),
        items.length - 1,
      ),
    );

    if (index !== currentIndex.current) {
      currentIndex.current = index;
      setActiveIndex(index);
    }
  };

  // ## 스크롤 종료 후 위치 정렬
  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const index = Math.max(
      0,
      Math.min(
        Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT),
        items.length - 1,
      ),
    );

    const selectedIndex = index % values.length;
    const selectedValue = values[selectedIndex];

    currentIndex.current = index;
    setActiveIndex(index);

    scrollRef.current?.scrollTo({
      y: index * ITEM_HEIGHT,
      animated: false,
    });

    if (selectedValue !== value) {
      onChange(selectedValue);
    }

    // 반복 배열 양 끝에서는 중앙으로 재배치
    if (
      index < values.length * 2 ||
      index >= items.length - values.length * 2
    ) {
      const centerIndex =
        CENTER_REPEAT * values.length + selectedIndex;

      currentIndex.current = centerIndex;
      setActiveIndex(centerIndex);

      scrollRef.current?.scrollTo({
        y: centerIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  };

  // ## 외부 선택값 동기화
  useEffect(() => {
    const currentValue =
      values[currentIndex.current % values.length];

    if (currentValue === value) return;

    const nextIndex =
      CENTER_REPEAT * values.length +
      Math.max(values.indexOf(value), 0);

    currentIndex.current = nextIndex;
    setActiveIndex(nextIndex);

    scrollRef.current?.scrollTo({
      y: nextIndex * ITEM_HEIGHT,
      animated: false,
    });
  }, [value, values]);

  // # Main UI
  return (
    <ScrollView
      ref={scrollRef}
      style={styles.column}
      contentContainerStyle={styles.scrollContent}
      contentOffset={{
        x: 0,
        y: initialIndex * ITEM_HEIGHT,
      }}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      snapToAlignment="start"
      decelerationRate="fast"
      disableIntervalMomentum
      bounces={false}
      overScrollMode="never"
      scrollEventThrottle={16}
      onScroll={handleScroll}
      onMomentumScrollEnd={handleScrollEnd}
      onScrollEndDrag={(event) => {
        if (Math.abs(event.nativeEvent.velocity?.y ?? 0) < 0.01) {
          handleScrollEnd(event);
        }
      }}
    >
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text
            style={[
              styles.itemText,
              index === activeIndex && styles.selectedText,
            ]}
          >
            {String(item).padStart(2, '0')}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

// # Main component
export default function TimePicker({
  value,
  onChange,
}: TimePickerProps) {
  return (
    <View style={styles.container}>
      {/* Selected Row */}
      <View pointerEvents="none" style={styles.selectedRow} />

      {/* Wheel Columns */}
      <View style={styles.columns}>
        <WheelColumn
          values={HOURS}
          value={value.hour}
          onChange={(hour) => onChange({ ...value, hour })}
        />

        <WheelColumn
          values={MINUTES}
          value={value.minute}
          onChange={(minute) => onChange({ ...value, minute })}
        />
      </View>
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: PICKER_HEIGHT,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },

  selectedRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: ITEM_HEIGHT * 2,
    height: ITEM_HEIGHT,
    borderRadius: radius.full,
    backgroundColor: palette.greyOpacity[50],
  },

  columns: {
    height: PICKER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },

  column: {
    width: 60,
    height: PICKER_HEIGHT,
    flexGrow: 0,
  },

  scrollContent: {
    paddingVertical: ITEM_HEIGHT * 2,
  },

  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemText: {
    fontFamily: fontFamily.default,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.text.additional,
    opacity: 0.6,
    includeFontPadding: false,
    textAlign: 'center',
  },

  selectedText: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.text.default,
    opacity: 1,
  },
});
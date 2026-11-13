import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CalendarDays, Copy, Plus, Trash2 } from 'lucide-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Button from '@/components/Button/Button';
import CircleIcon from '@/components/Icon/Circle';
import ListItemLayout from '@/components/List/ListItemLayout';

import { colors, palette } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { fontFamily } from '@/theme/typography';

// # 상수 영역
const ACTION_SIZE = 50;
const ACTION_GAP = 8;
const HORIZONTAL_PADDING = 16;

const ACTIONS_WIDTH = ACTION_SIZE * 2 + ACTION_GAP;
const SWIPE_DISTANCE = ACTIONS_WIDTH + ACTION_GAP + HORIZONTAL_PADDING;

const SWIPE_THRESHOLD = 12;
const ANIMATION_DURATION = 80;

// # 타입 영역
type DefaultTodoListProps = {
  variant?: 'default';
  value: string;
  onChangeText: (text: string) => void;
  trailingText?: string;
  onTrailingPress?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
  onFocus?: () => void;
  onInteraction?: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

type AddTodoListProps = {
  variant: 'add';
  onAdd: () => void;
};

type TodoListProps = DefaultTodoListProps | AddTodoListProps;

// # Add
function AddTodoList({ onAdd }: AddTodoListProps) {
  return (
    <Pressable
      onPress={onAdd}
      style={styles.addContainer}
      accessibilityRole="button"
      accessibilityLabel="할 일 추가"
    >
      <ListItemLayout
        leading={<Plus size={24} color={colors.icon.additional} />}
        middle={<Text style={styles.addText}>할 일 추가</Text>}
        gap={16}
        style={styles.listLayout}
      />
    </Pressable>
  );
}

// # Default
function DefaultTodoList({
  value,
  onChangeText,
  trailingText,
  onTrailingPress,
  onCopy,
  onDelete,
  onFocus,
  onInteraction,
  isOpen,
  onOpenChange,
}: DefaultTodoListProps) {
  const [containerWidth, setContainerWidth] = useState(0);

  const translateX = useSharedValue(0);

  // # 애니메이션 영역
  useEffect(() => {
    translateX.value = withTiming(isOpen ? -SWIPE_DISTANCE : 0, { duration: ANIMATION_DURATION });
  }, [isOpen, translateX]);

  const rowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_DISTANCE, 0], [1, 0], 'clamp'),
  }));

  // # 제스처 영역
  const panGesture = Gesture.Pan()
    .activeOffsetX([-SWIPE_THRESHOLD, SWIPE_THRESHOLD])
    .failOffsetY([-15, 15])
    .runOnJS(true)
    .onStart(() => {
      onInteraction?.();
    })
    .onEnd((event) => {
      if (!isOpen && event.translationX < -SWIPE_THRESHOLD) {
        onOpenChange(true);
      } else if (isOpen && event.translationX > SWIPE_THRESHOLD) {
        onOpenChange(false);
      }
    });

  // # Main UI
  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const width = event.nativeEvent.layout.width;

        setContainerWidth((previous) => (previous === width ? previous : width));
      }}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.row,
            rowAnimatedStyle,
            {
              width: containerWidth + SWIPE_DISTANCE,
            },
          ]}
        >
          {/* Content */}
          <View style={[styles.content, { width: containerWidth }]}>
            {/* Overlay */}
            <Animated.View pointerEvents="none" style={[styles.overlay, overlayAnimatedStyle]} />

            {/* Leading + Middle */}
            <View style={styles.list}>
              <ListItemLayout
                leading={<CircleIcon size={22} color={colors.icon.additional} />}
                middle={
                  <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => {
                      onInteraction?.();
                      onFocus?.();
                    }}
                    placeholder="할 일 추가"
                    placeholderTextColor={colors.text.disable}
                    style={styles.input}
                    returnKeyType="done"
                    accessibilityLabel="할 일 입력"
                  />
                }
                gap={16}
                style={styles.listLayout}
              />
            </View>

            {/* Trailing */}
            <Pressable
              onPress={() => {
                onInteraction?.();
                onTrailingPress?.();
              }}
              style={styles.trailing}
              accessibilityRole="button"
              accessibilityLabel="할 일 날짜 선택"
            >
              {trailingText ? (
                <Text style={styles.trailingText}>{trailingText}</Text>
              ) : (
                <CalendarDays size={24} color={value ? colors.icon.default : colors.icon.disable} />
              )}
            </Pressable>
          </View>

          {/* Swipe Actions */}
          {/* TODO: Button 컴포넌트 사이즈 지정 42*42 */}
          <View style={styles.actions}>
            <Button
              size="large"
              appearance="bordered"
              icon={Copy}
              accessibilityLabel="할 일 복사"
              onPress={() => {
                onCopy?.();
                onOpenChange(false);
              }}
            />

            {/* TODO: 공용 Button의 Bordered - Prominent 구현 후 교체 */}
            <Pressable
              style={styles.deleteButton}
              accessibilityRole="button"
              accessibilityLabel="할 일 삭제"
              onPress={() => {
                onDelete?.();
                onOpenChange(false);
              }}
            >
              <Trash2 size={22} color={colors.icon.white} />
            </Pressable>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

// # Main component
export default function TodoList(props: TodoListProps) {
  if (props.variant === 'add') {
    return <AddTodoList {...props} />;
  }

  return <DefaultTodoList {...props} />;
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    backgroundColor: 'transparent',
    borderTopRightRadius: radius.full,
    borderBottomRightRadius: radius.full,
    overflow: 'hidden',
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(28, 22, 48, 0.05)',
    borderTopRightRadius: radius.full,
    borderBottomRightRadius: radius.full,
  },

  list: {
    flex: 1,
    minWidth: 0,
  },

  listLayout: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },

  input: {
    padding: 0,
    color: colors.text.default,
    fontFamily: fontFamily.default,
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 22,
    letterSpacing: -0.2,
  },

  trailing: {
    minWidth: 50,
    height: 50,
    marginRight: HORIZONTAL_PADDING,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: palette.greyOpacity[50],
  },

  trailingText: {
    color: colors.text.default,
    fontSize: 14,
    fontWeight: '500',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ACTION_GAP,
    marginLeft: ACTION_GAP,
    paddingRight: HORIZONTAL_PADDING,
  },

  deleteButton: {
    width: ACTION_SIZE,
    height: ACTION_SIZE,
    borderRadius: radius.full,
    backgroundColor: palette.danger[200],
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ## Add
  addContainer: {
    width: '100%',
    minHeight: 50,
    justifyContent: 'center',
  },

  addText: {
    fontFamily: fontFamily.default,
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 22,
    letterSpacing: -0.2,
    color: colors.text.disable,
  },
});

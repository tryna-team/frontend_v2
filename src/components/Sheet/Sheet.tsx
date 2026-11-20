import type { ReactNode } from 'react';
import {
  View,
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

import Button44 from '@/components/Button/Button44/Button44';

// # 상수 영역
const SHEET_TOP_OFFSET = 62;

const CLOSE_THRESHOLD = 120;
const CLOSE_VELOCITY = 900;
const ANIMATION_DURATION = 220;

// # 타입 영역
type SheetProps = {
  children?: ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
};

// # Grabber component
function Grabber() {
  // TODO: Dark 모드용 Grabber가 별도로 존재하지만, 현재는 Light 모드만 지원
  return (
    <View style={styles.grabberContainer}>
      <View style={styles.grabber} />
    </View>
  );
}

// # Main component
export default function Sheet({
  children,
  onClose,
  showCloseButton = true,
}: SheetProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const sheetHeight = Math.max(0, height - SHEET_TOP_OFFSET);

  const translateY = useSharedValue(0);
  const isClosing = useSharedValue(false);

  // # 닫기 애니메이션
  const closeSheet = () => {
    if (!onClose || isClosing.get()) {
      return;
    }

    isClosing.set(true);

    translateY.set(
      withTiming(
        sheetHeight,
        { duration: ANIMATION_DURATION },
        (finished) => {
          if (finished) {
            runOnJS(onClose)();
          }
        },
      ),
    );
  };

  // # 드래그 제스처
  const panGesture = Gesture.Pan()
    .activeOffsetY(10)
    .failOffsetX([-20, 20])
    .onUpdate((event) => {
      if (isClosing.get()) {
        return;
      }

      translateY.set(Math.max(0, event.translationY));
    })
    .onEnd((event) => {
      if (isClosing.get()) {
        return;
      }

      const shouldClose =
        event.translationY > CLOSE_THRESHOLD ||
        event.velocityY > CLOSE_VELOCITY;

      if (shouldClose && onClose) {
        isClosing.set(true);

        translateY.set(
          withTiming(
            sheetHeight,
            { duration: ANIMATION_DURATION },
            (finished) => {
              if (finished) {
                runOnJS(onClose)();
              }
            },
          ),
        );

        return;
      }

      translateY.set(
        withTiming(0, {
          duration: ANIMATION_DURATION,
        }),
      );
    });

  // # 애니메이션 스타일
  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: translateY.get(),
      },
    ],
  }));

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={closeSheet}
    >
      <GestureHandlerRootView style={styles.container}>
        {/* Overlay */}
        <Pressable
          style={styles.overlay}
          onPress={closeSheet}
          disabled={!onClose}
          accessibilityRole="button"
          accessibilityLabel="시트 바깥 영역을 눌러 닫기"
        />

        {/* TODO: Sheet 높이를 화면 높이 - 62px로 반응형 처리하는 방식은 임시 결정이므로 디자인 확인 필요 */}
        <Animated.View
          style={[
            styles.sheet,
            { height: sheetHeight },
            animatedSheetStyle,
          ]}
        >
          {/* Header 드래그 영역 */}
          <GestureDetector gesture={panGesture}>
            <View style={styles.header}>
              <Grabber />

              {showCloseButton && onClose && (
                <View style={styles.closeButton}>
                  <Button44
                    appearance="bordered"
                    shadow
                    icon={X}
                    onPress={closeSheet}
                    accessibilityLabel="시트 닫기"
                  />
                </View>
              )}
            </View>
          </GestureDetector>

          {/* Content */}
          <View
            style={[
              styles.content,
              { paddingBottom: insets.bottom },
            ]}
          >
            {children}
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  overlay: {
    ...StyleSheet.absoluteFill,

    // TODO: theme/colors.ts에 색상 토큰 정의 후 교체
    backgroundColor: 'rgba(28, 22, 48, 0.30)',
  },

  sheet: {
    width: '100%',
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    overflow: 'hidden',

    // TODO: theme/colors.ts에 색상 토큰 정의 후 교체
    backgroundColor: '#FAFAFB',
  },

  header: {
    height: 58,
  },

  grabberContainer: {
    paddingTop: 6,
    alignItems: 'center',
  },

  grabber: {
    width: 60,
    height: 4,
    borderRadius: 100,

    // TODO: theme/colors.ts에 색상 토큰 정의 후 교체
    backgroundColor: '#D8D7DC',

    // TODO: Figma의 mix-blend-mode: plus-darker 적용 여부 검토
  },

  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },

  content: {
    flex: 1,
    flexDirection: 'column',
  },
});
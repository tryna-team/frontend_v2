
import type { ReactNode } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

import Button44 from '@/components/Button/Button44/Button44';

// # Types
type SheetProps = {
  children?: ReactNode;
  onClose?: () => void;
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
export default function Sheet({ children, onClose }: SheetProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={() => onClose?.()}
    >
      <View style={styles.container}>
        <View
          style={styles.overlay}
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />

        {/* TODO: Sheet 높이를 화면 높이 - 62px로 반응형 처리하는 방식은 임시 결정이므로 디자인 확인 필요 */}
        <View style={[styles.sheet, { height: Math.max(0, height - 62) }]}>
          <View style={styles.header}>
            <Grabber />

            {onClose && (
              <View style={styles.closeButton}>
                <Button44
                  appearance="bordered"
                  shadow
                  icon={X}
                  onPress={onClose}
                  accessibilityLabel="시트 닫기"
                />
              </View>
            )}
          </View>

          <View
            style={[styles.content, { paddingBottom: insets.bottom }]}
          >
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
}

// # Styles
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
    height: 76,
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

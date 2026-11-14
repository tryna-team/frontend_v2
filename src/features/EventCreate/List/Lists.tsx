import type { ReactNode } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { radius } from '@/theme/radius';

// # 타입 영역
type ListsProps = {
  variant?: 'default' | 'background';
  paddingVertical?: number;
  children: ReactNode;
};

// # Main component
export default function Lists({
  variant = 'default',
  paddingVertical,
  children,
}: ListsProps) {
  const isBackground = variant === 'background';

  return (
    <View
      style={[
        styles.container,
        isBackground && styles.background,
        isBackground && {
          paddingVertical: paddingVertical ?? 8,
        },
      ]}
    >
      {children}
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  background: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.large,
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.04)',

    // 내부 Todo 스와이프 영역이 Lists 바깥으로
    // 그려지지 않도록 제한
    overflow: 'hidden',
  },
});
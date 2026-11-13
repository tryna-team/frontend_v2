import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
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
        {
          paddingVertical:
            paddingVertical ?? (isBackground ? 8 : 0),
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
    flexDirection: 'column',
    gap: 0,
  },

  background: {
    borderRadius: radius.large,
    backgroundColor: colors.background.white,
    boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.04)',
  },
});
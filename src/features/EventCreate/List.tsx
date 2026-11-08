import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius } from '@/theme/radius';

// # 타입 영역
type ListProps = {
  variant?: 'background' | 'plain';
  children: ReactNode;
};

// # Main component
export default function List({
  variant = 'plain',
  children,
}: ListProps) {
  return (
    <View
      style={[
        styles.container,
        variant === 'background' && styles.background,
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
    gap: 0,
  },

  background: {
    paddingVertical: 8,
    borderRadius: radius.large,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.04)',
  },
});
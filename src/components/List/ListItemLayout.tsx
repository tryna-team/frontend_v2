// src/components/List/ListItemLayout.tsx

import type { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

import { spacing } from '@/theme/spacing';

// # 타입 영역
export type ListItemLayoutProps = {
  leading?: ReactNode;
  middle: ReactNode;

  date?: string;
  time?: string;

  gap?: number;

  style?: StyleProp<ViewStyle>;
  trailingStyle?: StyleProp<TextStyle>;
};

// # Main component
export default function ListItemLayout({
  leading,
  middle,
  date,
  time,
  gap = spacing.gap.small,
  style,
  trailingStyle,
}: ListItemLayoutProps) {
  const hasLeading = leading != null;
  const hasTrailing = Boolean(date || time);

  return (
    <View style={[styles.container, style]}>
      {/* Leading */}
      {hasLeading && (
        <View style={styles.leading}>
          {leading}
        </View>
      )}

      {/* Middle */}
      <View
        style={[
          styles.middle,
          hasLeading && { marginLeft: gap },
        ]}
      >
        {middle}
      </View>

      {/* Trailing */}
      {hasTrailing && (
        <View style={styles.trailing}>
          {date ? (
            <Text style={trailingStyle}>{date}</Text>
          ) : null}

          {time ? (
            <Text style={trailingStyle}>{time}</Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  leading: {
    flexShrink: 0,
  },

  middle: {
    flex: 1,
    minWidth: 0,
  },

  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap.xsmall, // 4px
    flexShrink: 0,
  },
});
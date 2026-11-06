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
  leading: ReactNode;
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
    gap: spacing.gap.xsmall,

    // TODO: Middle과 Trailing의 시각적 구분을 위한 임시 간격.
    // 디자인에서 필요 여부 및 정확한 간격 확인 후 조정.
    marginLeft: spacing.gap.xsmall,

    flexShrink: 0,
  },
});
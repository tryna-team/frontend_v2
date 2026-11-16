import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme/spacing';

import EventListItem from './EventListItem';
import type { EventListProps } from './EventType';

// # Main component
// Figma Lists: _List 묶음 (Figma는 Size 1~4, 코드는 받은 만큼 표시)
export default function EventList({ items, onEventPress, onLongPress }: EventListProps) {
  return (
    <View style={styles.container}>
      {items.map(({ id, onPress, ...item }) => (
        <EventListItem
          key={id}
          {...item}
          onPress={onPress ?? onEventPress}
          onLongPress={onLongPress}
        />
      ))}
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    gap: spacing.gap.small,
    paddingLeft: spacing.padding.medium,
  },
});

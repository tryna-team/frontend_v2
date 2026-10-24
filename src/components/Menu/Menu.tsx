import { View, StyleSheet } from 'react-native';

import BG from '@/components/Material/BG';
import MenuItem from './MenuItem';
import type { MenuProps } from './MenuType';

// # main component
export default function Menu({ items }: MenuProps) {
  return (
    <BG>
      <View style={styles.container}>
        {items.map((item) => (
          <MenuItem
            key={item.id}
            icon={item.icon}
            content={item.content}
            status={item.status}
            onPress={item.onPress}
          />
        ))}
      </View>
    </BG>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 8,
  },
});

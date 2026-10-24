import { View, StyleSheet } from 'react-native';
import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react-native';

import BG from '@/components/Material/BG';
import MenuItem from './MenuItem';

// # 타입 영역
type MenuItemData = {
  icon?: ComponentType<LucideProps>;
  content: string;
  status?: 'default' | 'destructive';
  onPress?: () => void;
};

type MenuProps = {
  items: MenuItemData[];
};

// # main component
export default function Menu({ items }: MenuProps) {
  return (
    <BG>
      <View style={styles.container}>
        {items.map((item, index) => (
          <MenuItem
            key={index}
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

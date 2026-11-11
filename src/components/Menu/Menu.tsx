import { View, StyleSheet } from 'react-native';

import BG from '@/components/Material/BG';
import MenuItem from './MenuItem';
import type { MenuProps } from './MenuType';

// # 상수 영역
// Figma Material/BG의 배경 블러(28px). BG의 기본값(0)을 바꾸면 Option·SearchField도 바뀌어서 Menu에서만 넘긴다
// TODO: expo-blur intensity(1~100)는 Figma 블러(28px)와 단위가 달라 실기기에서 맞춰봐야 함
const BLUR_INTENSITY = 28;

// # main component
export default function Menu({ items }: MenuProps) {
  return (
    <BG blur={BLUR_INTENSITY}>
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

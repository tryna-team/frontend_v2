import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react-native';

// # 타입 영역
export type MenuItemProps = {
  icon?: ComponentType<LucideProps>;
  content: string;
  status?: 'default' | 'destructive';
  isSelected?: boolean; // 현재 선택된 항목. 누를 때와 같은 배경으로 표시한다
  onPress?: () => void;
};

export type MenuItemData = MenuItemProps & {
  id: string;
};

export type MenuProps = {
  items: MenuItemData[];
};

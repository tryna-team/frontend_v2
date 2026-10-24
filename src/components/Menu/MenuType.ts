import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react-native';

// # 타입 영역
export type MenuItemProps = {
  icon?: ComponentType<LucideProps>;
  content: string;
  status?: 'default' | 'destructive';
  onPress?: () => void;
};

export type MenuProps = {
  items: MenuItemProps[];
};

import { SquareText, StretchHorizontal } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Menu from '@/components/Menu/Menu';
import type { MenuItemData } from '@/components/Menu/MenuType';
import { tempDesignValues } from '@/theme/tempDesignValues';
import type { MonthlyViewMode, ViewModeMenuProps } from '../CalendarType';

// # 상수 영역
const { viewModeMenu } = tempDesignValues;

// # Main component
// Figma Home/Montly Menu. Toolbar의 보기 버튼을 누르면 Toolbar 위에 겹쳐 띄우고, 바깥을 누르면 닫는다.
// Header보다 위에 그려야 해서 Layout 밖(Modal)에 두고, Sheet처럼 safe area를 직접 읽는다
export default function ViewModeMenu({ visible, viewMode, onSelect, onClose }: ViewModeMenuProps) {
  const safeArea = useSafeAreaInsets();

  const select = (mode: MonthlyViewMode) => {
    onSelect(mode);
    onClose();
  };

  // Figma Home/Montly Menu에서 회색 배경으로 그린 첫 항목은 현재 보기 방식을 뜻한다
  const items: MenuItemData[] = [
    {
      id: 'summary',
      icon: StretchHorizontal,
      content: '컴팩트',
      isSelected: viewMode === 'summary',
      onPress: () => select('summary'),
    },
    {
      id: 'detail',
      icon: SquareText,
      content: '상세형',
      isSelected: viewMode === 'detail',
      onPress: () => select('detail'),
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      {/* 메뉴 바깥. Figma에 배경을 어둡게 하는 층이 없어 투명하게 두고, 누르면 메뉴를 닫는다 */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="메뉴 닫기"
      />

      <View style={[styles.menu, { top: safeArea.top }]}>
        <Menu items={items} />
      </View>
    </Modal>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    right: viewModeMenu.right,
    width: viewModeMenu.width,
  },
});

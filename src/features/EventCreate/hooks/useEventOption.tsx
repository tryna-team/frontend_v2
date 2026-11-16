import { useState } from 'react';

import type { SectionData } from '@/components/Option/OptionType';
import { palette } from '@/theme/colors';
import { PaletteColor } from '@/components/Button/ButtonType';
// # 상수 영역
const REPEAT_OPTIONS = ['없음', '매일', '매주', '2주마다', '매월', '매년'];

const NOTIFICATION_OPTIONS = [
  '없음',
  '이벤트 시간',
  '5분 전',
  '10분 전',
  '15분 전',
  '30분 전',
  '1시간 전',
  '2시간 전',
  '1일 전',
  '2일 전',
  '1주 전',
];

// TODO: 사용자 계정 및 캘린더 연동 후 동적 데이터로 교체
const LABEL_GROUPS = [
  {
    title: 'Gmail',
    items: [{ id: 'gmail', name: 'Gmail Cal', color: '#E89A35' }],
  },
  {
    title: 'iCloud',
    items: [
      { id: 'icloud', name: 'iCloud Cal', color: '#608BEA' },
      { id: 'tryna', name: 'tryna', color: '#70C98B' },
      { id: 'school', name: 'School', color: '#B58AF1' },
    ],
  },
];

// TODO: 실제 라벨 색상과 Title 아이콘 배경색 매핑 확정
const LABEL_ICON_COLORS: Record<string, PaletteColor> = {
  gmail: palette.apricot[200],
  icloud: palette.blue[200],
  tryna: palette.green[300],
  school: palette.purple[100],
};

// # 타입 영역
export type ActiveModal = 'label' | 'repeat' | 'notification' | null;

// # Main Hook
export default function useEventOption() {
  // # Option 상태
  const [selectedLabel, setSelectedLabel] = useState('gmail');
  const [repeat, setRepeat] = useState('없음');
  const [notification, setNotification] = useState('없음');

  // # Modal 상태
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // # Modal 함수
  const handleOpenModal = (modal: Exclude<ActiveModal, null>) => {
    setActiveModal(modal);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  // # Option 선택 함수
  const handleSelectLabel = (id: string) => {
    setSelectedLabel(id);
    setActiveModal(null);
  };

  const handleSelectRepeat = (value: string) => {
    setRepeat(value);
    setActiveModal(null);
  };

  const handleSelectNotification = (value: string) => {
    setNotification(value);
    setActiveModal(null);
  };

  // # Option 데이터
  const labelSections: SectionData[] = LABEL_GROUPS.map((group) => ({
    title: group.title,
    items: group.items.map((item) => ({
      id: item.id,
      content: item.name,
      selection: selectedLabel === item.id,
      icon: true,
      iconColor: item.color,
      onPress: () => handleSelectLabel(item.id),
    })),
  }));

  const repeatSections: SectionData[] = [
    {
      items: REPEAT_OPTIONS.map((value) => ({
        id: value,
        content: value,
        selection: repeat === value,
        onPress: () => handleSelectRepeat(value),
      })),
    },
  ];

  const notificationSections: SectionData[] = [
    {
      items: [
        {
          id: 'none',
          content: '없음',
          selection: notification === '없음',
          onPress: () => handleSelectNotification('없음'),
        },
      ],
    },
    {
      items: NOTIFICATION_OPTIONS.slice(1).map((value) => ({
        id: value,
        content: value,
        selection: notification === value,
        onPress: () => handleSelectNotification(value),
      })),
    },
  ];

  // # 현재 선택된 Option 데이터
  const currentSections =
    activeModal === 'label'
      ? labelSections
      : activeModal === 'repeat'
        ? repeatSections
        : notificationSections;

  return {
    // 상태
    selectedLabel,
    repeat,
    notification,
    activeModal,

    // 표시 데이터
    TitleLabelColor: LABEL_ICON_COLORS[selectedLabel],
    currentSections,

    // 상태 변경
    setActiveModal,

    // 이벤트 함수
    handleOpenModal,
    handleCloseModal,
  };
}

import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Bell, FileText, Link, MapPin, RotateCw } from 'lucide-react-native';

import Option from '@/components/Option/Option';
import type { SectionData } from '@/components/Option/OptionType';

import Title from './Title';
import Period, { type SelectedPeriod } from './Period';
import Picker from './Picker/Picker';
import type { TimePickerValue } from './Picker/TimePicker';

import List from './List/List';
import Lists from './List/Lists';
import TodoList from './List/TodoList';

// # 상수 영역
const POPOVER_WIDTH = 219;

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
    items: [
      {
        id: 'gmail',
        name: 'Gmail Cal',
        color: '#E89A35',
      },
    ],
  },
  {
    title: 'iCloud',
    items: [
      {
        id: 'icloud',
        name: 'iCloud Cal',
        color: '#608BEA',
      },
      {
        id: 'tryna',
        name: 'tryna',
        color: '#70C98B',
      },
      {
        id: 'school',
        name: 'School',
        color: '#B58AF1',
      },
    ],
  },
];

// TODO: 실제 라벨 색상과 Title 아이콘 배경색 매핑 확정
const LABEL_ICON_COLORS: Record<string, string> = {
  gmail: '#F8DEB7',
  icloud: '#DDE8FF',
  tryna: '#DDF4E4',
  school: '#EBDDFF',
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// # 타입 영역
type EventCreateProps = {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

type TodoItem = {
  id: number;
  value: string;
};

type ActiveModal = 'label' | 'repeat' | 'notification' | null;

type PeriodTarget = Exclude<SelectedPeriod, null>;

// # 유틸 함수
// TODO: API 날짜 형식 확정 후 문자열 파싱 대신 ISO 날짜 또는 Date 기반으로 통일
function parseDateTime(dateText: string, timeText: string): Date {
  const now = new Date();

  const dateMatch = dateText.match(/(?:(\d{4})[.-]\s*)?(\d{1,2})월\s*(\d{1,2})일/);

  const timeMatch = timeText.match(/^(\d{1,2}):(\d{2})$/);

  if (!dateMatch || !timeMatch) {
    // TODO: 잘못된 초기 날짜·시간에 대한 오류 처리 정책 확정
    return new Date(now);
  }

  const year = dateMatch[1] ? Number(dateMatch[1]) : now.getFullYear();

  const month = Number(dateMatch[2]) - 1;
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);

  return new Date(year, month, day, hour, minute);
}

function formatDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS[date.getDay()];

  return `${month}월 ${day}일 (${weekday})`;
}

function formatTime(date: Date): string {
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${hour}:${minute}`;
}

function getTimeValue(date: Date): TimePickerValue {
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}

// # Main component
export default function EventCreate({ startDate, startTime, endDate, endTime }: EventCreateProps) {
  const nextIdRef = useRef(1);

  const [title, setTitle] = useState('');

  // # Label 상태
  const [selectedLabel, setSelectedLabel] = useState('gmail');
  const [titleHeight, setTitleHeight] = useState(0);

  // # Period 상태
  const [startDateTime, setStartDateTime] = useState(() => parseDateTime(startDate, startTime));

  const [endDateTime, setEndDateTime] = useState(() => parseDateTime(endDate, endTime));

  const [selectedPeriod, setSelectedPeriod] = useState<SelectedPeriod>(null);

  const [isAllDay, setIsAllDay] = useState(false);

  // # List 상태
  const [repeat, setRepeat] = useState('없음');
  const [notification, setNotification] = useState('없음');
  const [location, setLocation] = useState('');
  const [url, setUrl] = useState('');
  const [memo, setMemo] = useState('');

  // # Modal 상태
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [listLayerTop, setListLayerTop] = useState(0);

  // # Todo 상태
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);

  // # 선택된 날짜·시간
  const selectedDateTime = selectedPeriod === 'end' ? endDateTime : startDateTime;

  // # Todo 외부 탭 감지
  const outsideTap = Gesture.Tap()
    .maxDistance(10)
    .runOnJS(true)
    .onEnd((_event, success) => {
      if (success) {
        setOpenId(null);
      }
    });

  // # Period 함수
  const handlePeriodPress = (period: PeriodTarget) => {
    setOpenId(null);
    setActiveModal(null);

    setSelectedPeriod((previous) => (previous === period ? null : period));
  };

  const handleAllDayChange = (value: boolean) => {
    setIsAllDay(value);
    setOpenId(null);
    setActiveModal(null);

    // Picker가 열려 있다면 닫지 않고 variant만 변경
  };

  const handlePickerDateChange = (date: Date) => {
    const updateDate = (previous: Date) => {
      const next = new Date(previous);

      next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());

      return next;
    };

    if (selectedPeriod === 'start') {
      setStartDateTime(updateDate);
    } else if (selectedPeriod === 'end') {
      setEndDateTime(updateDate);
    }
  };

  const handlePickerTimeChange = (time: TimePickerValue) => {
    const updateTime = (previous: Date) => {
      const next = new Date(previous);

      next.setHours(time.hour, time.minute, 0, 0);

      return next;
    };

    if (selectedPeriod === 'start') {
      setStartDateTime(updateTime);
    } else if (selectedPeriod === 'end') {
      setEndDateTime(updateTime);
    }
  };

  // # Modal 함수
  const handleOpenModal = (modal: Exclude<ActiveModal, null>) => {
    setOpenId(null);
    setSelectedPeriod(null);
    setActiveModal(modal);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

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

  // # Todo 함수
  const handleAddTodo = () => {
    const id = nextIdRef.current++;

    setTodos((previous) => [...previous, { id, value: '' }]);

    setOpenId(null);
    setActiveModal(null);
  };

  const handleChangeTodo = (id: number, text: string) => {
    setTodos((previous) =>
      previous.map((todo) => (todo.id === id ? { ...todo, value: text } : todo)),
    );
  };

  const handleCopyTodo = (id: number) => {
    const target = todos.find((todo) => todo.id === id);

    if (!target) return;

    const newId = nextIdRef.current++;

    setTodos((previous) => [
      ...previous,
      {
        id: newId,
        value: target.value,
      },
    ]);

    setOpenId(null);
  };

  const handleDeleteTodo = (id: number) => {
    setTodos((previous) => previous.filter((todo) => todo.id !== id));

    setOpenId(null);
  };

  // # Option 선택
  const currentSections =
    activeModal === 'label'
      ? labelSections
      : activeModal === 'repeat'
        ? repeatSections
        : notificationSections;

  // # Main UI
  return (
    <GestureDetector gesture={outsideTap}>
      <View style={styles.root}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentInner}>
            {/* Title + Period + Picker */}
            <View style={styles.headerContent}>
              {/* Title */}
              <View
                onLayout={(event) => {
                  const height = event.nativeEvent.layout.height;

                  setTitleHeight((previous) => (previous === height ? previous : height));
                }}
              >
                <Title
                  value={title}
                  onChangeText={setTitle}
                  onIconPress={() => handleOpenModal('label')}
                  iconBackgroundColor={LABEL_ICON_COLORS[selectedLabel]}
                  onFocus={() => {
                    setOpenId(null);
                    setActiveModal(null);
                    setSelectedPeriod(null);
                  }}
                />
              </View>

              {/* Period + Picker */}
              <View style={styles.periodContent}>
                <Period
                  startDate={formatDate(startDateTime)}
                  startTime={formatTime(startDateTime)}
                  endDate={formatDate(endDateTime)}
                  endTime={formatTime(endDateTime)}
                  selectedPeriod={selectedPeriod}
                  isAllDay={isAllDay}
                  onPeriodPress={handlePeriodPress}
                  onAllDayChange={handleAllDayChange}
                />

                {/* 선택된 영역이 있을 때만 Picker 표시 */}
                {selectedPeriod && (
                  <View style={styles.picker}>
                    <Picker
                      key={selectedPeriod}
                      variant={isAllDay ? 'date' : 'dateTime'}
                      date={selectedDateTime}
                      onDateChange={handlePickerDateChange}
                      time={getTimeValue(selectedDateTime)}
                      onTimeChange={handlePickerTimeChange}
                    />
                  </View>
                )}
              </View>
            </View>

            {/* ListLayer */}
            <View
              style={styles.listLayer}
              onLayout={(event) => {
                const top = event.nativeEvent.layout.y;

                setListLayerTop((previous) => (previous === top ? previous : top));
              }}
            >
              {/* 1. 반복 / 알림 */}
              <Lists variant="default">
                <List
                  variant="modal"
                  icon={RotateCw}
                  placeholder="반복 없음"
                  value={repeat === '없음' ? '' : repeat}
                  onPress={() => handleOpenModal('repeat')}
                />

                <List
                  variant="modal"
                  icon={Bell}
                  placeholder="알림 없음"
                  value={notification === '없음' ? '' : notification}
                  onPress={() => handleOpenModal('notification')}
                />
              </Lists>

              {/* 2. TodoList */}
              <Lists variant="background" paddingVertical={0}>
                {todos.map((todo) => (
                  <TodoList
                    key={todo.id}
                    variant="default"
                    value={todo.value}
                    onChangeText={(text) => handleChangeTodo(todo.id, text)}
                    onFocus={() => {
                      if (openId !== todo.id) {
                        setOpenId(null);
                      }

                      setActiveModal(null);
                      setSelectedPeriod(null);
                    }}
                    onInteraction={() => {
                      if (openId !== todo.id) {
                        setOpenId(null);
                      }
                    }}
                    onCopy={() => handleCopyTodo(todo.id)}
                    onDelete={() => handleDeleteTodo(todo.id)}
                    isOpen={openId === todo.id}
                    onOpenChange={(open) => setOpenId(open ? todo.id : null)}
                  />
                ))}

                <TodoList variant="add" onAdd={handleAddTodo} />
              </Lists>

              {/* 3. 위치 / URL / 메모 */}
              <Lists variant="background">
                <List
                  variant="input"
                  icon={MapPin}
                  placeholder="위치"
                  value={location}
                  onChangeText={setLocation}
                />

                <View style={styles.separator} />

                <List
                  variant="input"
                  icon={Link}
                  placeholder="URL"
                  value={url}
                  onChangeText={setUrl}
                />

                <View style={styles.separator} />

                <List
                  variant="input"
                  icon={FileText}
                  placeholder="메모"
                  value={memo}
                  onChangeText={setMemo}
                />
              </Lists>
            </View>

            {/* Option Layer */}
            {activeModal && (
              <View style={styles.optionLayer}>
                {/* 외부 터치 시 닫기 */}
                <Pressable
                  style={StyleSheet.absoluteFill}
                  onPress={handleCloseModal}
                  accessibilityRole="button"
                  accessibilityLabel="선택 메뉴 닫기"
                />

                {/* Option Popover */}
                <View
                  style={[
                    styles.optionPosition,
                    activeModal === 'label'
                      ? {
                          top: titleHeight,
                          alignItems: 'flex-start',
                        }
                      : {
                          top: listLayerTop,
                          alignItems: 'flex-end',
                        },
                  ]}
                  pointerEvents="box-none"
                >
                  <View style={styles.option}>
                    <Option sections={currentSections} />
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </GestureDetector>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
  },

  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
  },

  content: {
    paddingBottom: 32,
  },

  contentInner: {
    width: '100%',
  },

  // ## Title + Period
  headerContent: {
    gap: 32,
  },

  // ## Period + Picker
  periodContent: {
    gap: 24,
  },

  picker: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
  },

  // ## ListLayer
  listLayer: {
    marginTop: 16,
    gap: 32,
  },

  separator: {
    height: 1,
    marginHorizontal: 16,
    backgroundColor: '#1C16300D',
  },

  // ## Option Layer
  optionLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
    elevation: 10,
  },

  optionPosition: {
    position: 'absolute',
    left: 0,
    right: 0,
  },

  option: {
    width: POPOVER_WIDTH,
    borderRadius: 30,
    overflow: 'hidden',
  },
});

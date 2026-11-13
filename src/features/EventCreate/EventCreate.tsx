import { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Bell,
  FileText,
  Link,
  MapPin,
  RotateCw,
} from 'lucide-react-native';

import Option from '@/components/Option/Option';
import type { SectionData } from '@/components/Option/OptionType';

import Title from './Title';
import Period from './Period';
import List from './List/List';
import Lists from './List/Lists';
import TodoList from './List/TodoList';

// # 상수 영역
const POPOVER_WIDTH = 219;

const REPEAT_OPTIONS = [
  '없음',
  '매일',
  '매주',
  '2주마다',
  '매월',
  '매년',
];

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

type ActiveModal = 'repeat' | 'notification' | null;

// # Main component
export default function EventCreate({
  startDate,
  startTime,
  endDate,
  endTime,
}: EventCreateProps) {
  const nextIdRef = useRef(1);

  const [title, setTitle] = useState('');

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

  // # Modal 함수
  const handleOpenModal = (
    modal: Exclude<ActiveModal, null>,
  ) => {
    setOpenId(null);
    setActiveModal(modal);
  };

  const handleCloseModal = () => {
    // 선택값은 유지하고 팝오버만 닫기
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

    setTodos((previous) => [
      ...previous,
      { id, value: '' },
    ]);

    setOpenId(null);
  };

  const handleChangeTodo = (id: number, text: string) => {
    setTodos((previous) =>
      previous.map((todo) =>
        todo.id === id
          ? { ...todo, value: text }
          : todo,
      ),
    );
  };

  const handleCopyTodo = (id: number) => {
    const target = todos.find((todo) => todo.id === id);

    if (!target) return;

    const newId = nextIdRef.current++;

    setTodos((previous) => [
      ...previous,
      { id: newId, value: target.value },
    ]);

    setOpenId(null);
  };

  const handleDeleteTodo = (id: number) => {
    setTodos((previous) =>
      previous.filter((todo) => todo.id !== id),
    );

    setOpenId(null);
  };

  // # Main UI
  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentInner}>
          {/* Title + Period */}
          <View style={styles.headerContent}>
            <Title
              value={title}
              onChangeText={setTitle}
            />

            <Period
              startDate={startDate}
              startTime={startTime}
              endDate={endDate}
              endTime={endTime}
            />
          </View>

          {/* ListLayer */}
          <View
            style={styles.listLayer}
            onLayout={(event) => {
              const top = event.nativeEvent.layout.y;

              setListLayerTop((previous) =>
                previous === top ? previous : top,
              );
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
                value={
                  notification === '없음'
                    ? ''
                    : notification
                }
                onPress={() => handleOpenModal('notification')}
              />
            </Lists>

            {/* 2. TodoList */}
            <Lists
              variant="background"
              paddingVertical={0}
            >
              {todos.map((todo) => (
                <TodoList
                  key={todo.id}
                  variant="default"
                  value={todo.value}
                  onChangeText={(text) =>
                    handleChangeTodo(todo.id, text)
                  }
                  onCopy={() => handleCopyTodo(todo.id)}
                  onDelete={() => handleDeleteTodo(todo.id)}
                  isOpen={openId === todo.id}
                  onOpenChange={(open) =>
                    setOpenId(open ? todo.id : null)
                  }
                />
              ))}

              <TodoList
                variant="add"
                onAdd={handleAddTodo}
              />
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
                  { top: listLayerTop },
                ]}
                pointerEvents="box-none"
              >
                <View style={styles.option}>
                  <Option
                    sections={
                      activeModal === 'repeat'
                        ? repeatSections
                        : notificationSections
                    }
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
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
    alignItems: 'flex-end',
  },

  option: {
    width: POPOVER_WIDTH,
    borderRadius: 30,
    overflow: 'hidden',
  },
});
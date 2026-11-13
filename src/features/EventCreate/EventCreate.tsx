import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Bell,
  FileText,
  Link,
  MapPin,
  RotateCw,
} from 'lucide-react-native';

import Title from './Title';
import Period from './Period';
import List from './List/List';
import Lists from './List/Lists';
import TodoList from './List/TodoList';

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
  const [title, setTitle] = useState('');

  // # List 상태
  const [repeat] = useState('');
  const [notification] = useState('');
  const [location, setLocation] = useState('');
  const [url, setUrl] = useState('');
  const [memo, setMemo] = useState('');

  // # Modal 상태
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // # Todo 상태
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);

  // # Modal 함수
  const handleOpenModal = (modal: Exclude<ActiveModal, null>) => {
    setActiveModal(modal);

    // TODO: 반복/알림 선택 모달 구현 후 연결
  };

  // # Todo 함수
  const handleAddTodo = () => {
    setTodos((previous) => [
      ...previous,
      { id: nextId, value: '' },
    ]);

    setNextId((previous) => previous + 1);
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

    setTodos((previous) => [
      ...previous,
      { id: nextId, value: target.value },
    ]);

    setNextId((previous) => previous + 1);
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
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
      <View style={styles.listLayer}>
        {/* 1. 반복 / 알림 */}
        <Lists variant="default">
          <List
            variant="modal"
            icon={RotateCw}
            placeholder="반복 없음"
            value={repeat}
            onPress={() => handleOpenModal('repeat')}
          />

          <List
            variant="modal"
            icon={Bell}
            placeholder="알림 없음"
            value={notification}
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
    </ScrollView>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    width: '100%',
  },

  content: {
    paddingBottom: 32,
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
});
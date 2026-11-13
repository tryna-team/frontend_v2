import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Bell,
  FileText,
  Link,
  MapPin,
  RotateCw,
} from 'lucide-react-native';

import { colors } from '@/theme/colors';
import { fontFamily } from '@/theme/typography';

import Title from './Title';
import Period from './Period';
import List from './List/List';
import Lists from './List/Lists';
import TodoList from './TodoList';

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

type ListRowProps = {
  icon: typeof Bell;
  label: string;
  onPress?: () => void;
};

// # ListRow
function ListRow({
  icon: Icon,
  label,
  onPress,
}: ListRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.listRow}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Icon
        size={24}
        color={colors.icon.additional}
      />

      <Text style={styles.listText}>
        {label}
      </Text>
    </Pressable>
  );
}

// # Main component
export default function EventCreate({
  startDate,
  startTime,
  endDate,
  endTime,
}: EventCreateProps) {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);

  // # 함수 영역
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
          <List>
            <ListRow
              icon={RotateCw}
              label="반복 없음"
            />
          </List>

          <List>
            <ListRow
              icon={Bell}
              label="알림 없음"
            />
          </List>
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
          <List>
            <ListRow
              icon={MapPin}
              label="위치"
            />
          </List>

          <View style={styles.separator} />

          <List>
            <ListRow
              icon={Link}
              label="URL"
            />
          </List>

          <View style={styles.separator} />

          <List>
            <ListRow
              icon={FileText}
              label="메모"
            />
          </List>
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

  // ## List
  listRow: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
  },

  listText: {
    fontFamily: fontFamily.default,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.2,
    color: colors.text.disable,
    includeFontPadding: false,
  },

  separator: {
    height: 1,
    marginHorizontal: 16,
    backgroundColor: colors.divider.default,
  },
});
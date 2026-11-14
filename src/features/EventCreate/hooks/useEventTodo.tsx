import { useRef, useState } from 'react';

// # 타입 영역
export type TodoItem = {
  id: number;
  value: string;
  date: Date | null;
};

// # Main Hook
export default function useEventTodo() {
  const nextIdRef = useRef(1);

  // # Todo 상태
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedTodoDateId, setSelectedTodoDateId] = useState<number | null>(null);

  // # Todo 함수
  const handleAddTodo = () => {
    const id = nextIdRef.current++;

    setTodos((previous) => [...previous, { id, value: '', date: null }]);

    setOpenId(null);
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
        date: target.date ? new Date(target.date) : null,
      },
    ]);

    setOpenId(null);
  };

  const handleDeleteTodo = (id: number) => {
    setTodos((previous) => previous.filter((todo) => todo.id !== id));

    setOpenId(null);

    if (selectedTodoDateId === id) {
      setSelectedTodoDateId(null);
    }
  };

  // # Todo 날짜 함수
  const handleTodoDatePress = (id: number) => {
    setOpenId(null);

    setSelectedTodoDateId((previous) => (previous === id ? null : id));
  };

  const handleTodoDateChange = (id: number, date: Date) => {
    setTodos((previous) =>
      previous.map((todo) => (todo.id === id ? { ...todo, date: new Date(date) } : todo)),
    );
  };

  // # Todo 스와이프 함수
  const handleTodoOpenChange = (id: number, open: boolean) => {
    setOpenId(open ? id : null);

    if (open) {
      setSelectedTodoDateId(null);
    }
  };

  return {
    // 상태
    todos,
    openId,
    selectedTodoDateId,

    // 상태 변경
    setOpenId,
    setSelectedTodoDateId,

    // 이벤트 함수
    handleAddTodo,
    handleChangeTodo,
    handleCopyTodo,
    handleDeleteTodo,
    handleTodoDatePress,
    handleTodoDateChange,
    handleTodoOpenChange,
  };
}

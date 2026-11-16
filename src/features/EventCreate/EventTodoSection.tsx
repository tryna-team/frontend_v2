import { StyleSheet, Text, View } from 'react-native';
import { RefreshCcw } from 'lucide-react-native';

import Button from '@/components/Button/Button';

import { colors, palette } from '@/theme/colors';
import { fontFamily } from '@/theme/typography';

import Picker from './Picker/Picker';
import Lists from './List/Lists';
import TodoList from './List/TodoList';

import type { TodoItem } from './hooks/useEventTodo';
import { formatTodoDate } from './utils/date';

// # 상수 영역
// TODO: 추천 API 연동 후 추천 결과가 성공적으로 생성된 경우에만 Footer 표시
// 현재는 Footer UI 확인을 위해 true로 고정
const SHOW_RECOMMENDATION_FOOTER = true;

// # 타입 영역
type EventTodoSectionProps = {
  // Todo 상태
  todos: TodoItem[];
  openId: number | null;
  selectedTodoDateId: number | null;

  // 일정 기간
  startDateTime: Date;
  endDateTime: Date;

  // Todo 이벤트
  onAddTodo: () => void;
  onChangeTodo: (id: number, text: string) => void;
  onCopyTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;

  // 날짜 이벤트
  onTodoDatePress: (id: number) => void;
  onTodoDateChange: (id: number, date: Date) => void;

  // 상호작용 이벤트
  onTodoFocus: (id: number) => void;
  onTodoInteraction: (id: number) => void;
  onTodoOpenChange: (id: number, open: boolean) => void;
};

// # Main component
export default function EventTodoSection({
  todos,
  openId,
  selectedTodoDateId,
  startDateTime,
  endDateTime,
  onAddTodo,
  onChangeTodo,
  onCopyTodo,
  onDeleteTodo,
  onTodoDatePress,
  onTodoDateChange,
  onTodoFocus,
  onTodoInteraction,
  onTodoOpenChange,
}: EventTodoSectionProps) {
  return (
    <View style={styles.container}>
      {/* TodoList + DatePicker */}
      <Lists variant="background" paddingVertical={0}>
        {todos.map((todo) => {
          const isDatePickerOpen = selectedTodoDateId === todo.id;

          return (
            <View key={todo.id} style={styles.todoWithPicker}>
              <TodoList
                variant="default"
                value={todo.value}
                onChangeText={(text) => onChangeTodo(todo.id, text)}
                trailingText={formatTodoDate(todo.date, startDateTime, endDateTime)}
                isDatePickerOpen={isDatePickerOpen}
                onTrailingPress={() => onTodoDatePress(todo.id)}
                onFocus={() => onTodoFocus(todo.id)}
                onInteraction={() => onTodoInteraction(todo.id)}
                onCopy={() => onCopyTodo(todo.id)}
                onDelete={() => onDeleteTodo(todo.id)}
                isOpen={openId === todo.id}
                onOpenChange={(open) => onTodoOpenChange(todo.id, open)}
              />

              {/* TodoList 바로 아래: 간격 0 */}
              {isDatePickerOpen && (
                <View style={styles.todoPicker}>
                  <Picker
                    variant="date"
                    date={todo.date ?? startDateTime}
                    onDateChange={(date) => onTodoDateChange(todo.id, date)}
                  />
                </View>
              )}
            </View>
          );
        })}

        <TodoList variant="add" onAdd={onAddTodo} />
      </Lists>

      {/* TODO: 추천 API 연동 후 추천 완료 상태를 기준으로 Footer 조건부 렌더링 */}
      {SHOW_RECOMMENDATION_FOOTER && (
        <View style={styles.footer}>
          {/* Leading */}
          <Text style={styles.footerText}>중간고사 전에 확인해 보세요!</Text>

          {/* Trailing */}
          <Button
            size="medium"
            appearance="bordered"
            bgColor={palette.grey[100]}
            icon={RefreshCcw}
            accessibilityLabel="할 일 다시 추천받기"
            // TODO: 추천 API 연동 후 재추천 함수 연결
          />
        </View>
      )}
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },

  todoWithPicker: {
    width: '100%',
    gap: 0,
  },

  todoPicker: {
    width: '100%',
    overflow: 'hidden',
  },

  // ## Footer
  footer: {
    width: '100%',
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 12,
  },

  footerText: {
    // TODO: TDS Subheadline 타이포그래피 정의 후 공통 토큰으로 교체
    flexShrink: 1,
    fontFamily: fontFamily.default,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: -0.2,
    color: colors.text.default,
    includeFontPadding: false,
  },
});

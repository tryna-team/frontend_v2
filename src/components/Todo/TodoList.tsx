import { View, StyleSheet } from 'react-native';

import { spacing } from '@/theme/spacing';

import TodoItem from './TodoItem';
import type { DailyTodoData, EventViewTodoData, EventCreateTodoData } from './TodoType';

// # 타입 영역
// ## list props
export type TodoListBaseProps = {
  onLeadingClick?: (id: number) => void;
};

export type TodoListProps = TodoListBaseProps &
  (
    | {
        variant: 'daily';
        items: DailyTodoData[];
      }
    | {
        variant: 'eventView';
        items: EventViewTodoData[];
      }
    | {
        variant: 'eventCreate';
        items: EventCreateTodoData[];
        onDateClick: (id: number) => void;
        onTextChange: (id: number, text: string) => void;
        onAdd: () => void;
      }
  );

// # Main component
export default function TodoList(props: TodoListProps) {
  // daily
  if (props.variant === 'daily') {
    return (
      <View style={styles.container}>
        {props.items.map((item) => (
          <TodoItem
            key={item.id}
            variant="daily"
            status={item.status}
            text={item.text}
            date={item.date}
            onLeadingClick={() => props.onLeadingClick?.(item.id)}
          />
        ))}
      </View>
    );
  }

  // eventView
  else if (props.variant === 'eventView') {
    return (
      <View style={[styles.container, styles.eventView]}>
        {props.items.map((item) => (
          <TodoItem
            key={item.id}
            variant="eventView"
            status={item.status}
            text={item.text}
            date={item.date}
            onLeadingClick={() => props.onLeadingClick?.(item.id)}
          />
        ))}
      </View>
    );
  }

  // eventCreate
  else {
    return (
      <View style={styles.container}>
        {props.items.map((item) => (
          <TodoItem
            key={item.id}
            variant="eventCreate"
            status={item.status}
            text={item.text}
            date={item.date}
            onLeadingClick={() => props.onLeadingClick?.(item.id)}
            onDateClick={() => props.onDateClick(item.id)}
            onTextChange={(text) => props.onTextChange(item.id, text)}
          />
        ))}

        {/* plus button */}
        <TodoItem
          variant="eventCreate"
          status="plus"
          text="할 일 추가"
          onLeadingClick={props.onAdd}
        />
      </View>
    );
  }
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
  },
  eventView: {
    gap: spacing.gap.xsmall,
  },
});

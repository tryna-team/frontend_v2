import { useState } from 'react';
import { Pressable, View, Text, TextInput, StyleSheet } from 'react-native';
import type { TodoVariant, TodoStatus } from './TodoType';

// # 타입 영역
// ## common type
type TodoItemBaseProps = {
  text: string; // middle text content
  onLeadingClick?: () => void; // callback for leading element click
};

export type TodoItemProps = TodoItemBaseProps &
  (
    | {
        variant: 'daily';
        status: 'done' | 'unDone';
        date?: string;
      }
    | {
        variant: 'eventView';
        status: 'done' | 'unDone';
        date: string;
      }
    | {
        variant: 'eventCreate';
        status: 'selected' | 'unSelected';
        date: string;
        onDateClick: () => void;
        onTextChange: (text: string) => void;
      }
    | {
        variant: 'eventCreate';
        status: 'plus';
      }
  );

// # 함수 영역
// ## Leading fuction
function getPlaceholderColor(status: TodoStatus): string {
  switch (status) {
    case 'done':
      return '#16A34A';
    case 'unDone':
      return '#D1D5DB';
    case 'selected':
      return '#3B82F6';
    case 'unSelected':
      return '#E5E7EB';
    case 'plus':
      return '#F59E0B';
  }
}

function getPlaceholderSize(variant: TodoVariant, status: TodoStatus): number {
  return variant === 'daily' || (variant === 'eventCreate' && status === 'plus') ? 20 : 24;
}

function getLabelText(status: TodoStatus): string {
  switch (status) {
    case 'done':
      return '완료';
    case 'unDone':
      return '미완료';
    case 'selected':
      return '선택됨';
    case 'unSelected':
      return '선택 안됨';
    case 'plus':
      return '할 일 추가';
  }
}

function Leading(props: TodoItemProps) {
  const backgroundColor = getPlaceholderColor(props.status);
  const size = getPlaceholderSize(props.variant, props.status);
  const labelText = getLabelText(props.status);

  return (
    <Pressable
      accessibilityRole={props.status === 'plus' ? 'button' : 'checkbox'}
      accessibilityLabel={labelText}
      accessibilityState={{
        checked:
          props.status === 'plus'
            ? undefined
            : props.status === 'done' || props.status === 'selected',

        disabled: props.variant === 'daily',
      }}
      disabled={props.variant === 'daily'}
      onPress={props.onLeadingClick}
      style={styles.leading}
    >
      {/* TODO: 실제 Todo 아이콘 구현 후 Placeholder 교체 */}
      {/* 현재 색상은 status 변경 테스트를 위한 임시 값 */}
      <View
        style={[
          styles.iconPlaceholder,
          {
            width: size,
            height: size,
            backgroundColor,
          },
        ]}
      />
    </Pressable>
  );
}

// ## middle function
// TODO: 실제 TDS Typography 토큰 값으로 교체
function getMiddleTypo(variant: TodoVariant, status: TodoStatus) {
  if (variant === 'daily') {
    return styles.textSmall;
  } else if (variant === 'eventCreate' && status === 'plus') {
    return styles.textMedium;
  } else {
    return styles.textLarge;
  }
}

// TODO: 실제 TDS 색상 토큰 값으로 교체
function getMiddleColor(status: TodoStatus): string {
  return status === 'unDone' || status === 'selected'
    ? '#111111'
    : '#B0B0B0';
}

function Middle(props: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const typo = getMiddleTypo(props.variant, props.status);
  const color = getMiddleColor(props.status);

  // TODO: 텍스트가 길어질 때 말줄임 처리 여부 결정

  // eventCreate: selected + 편집 중
  if(props.variant === 'eventCreate' && props.status === 'selected' && isEditing) {
    return (
      <TextInput
        value={props.text}
        autoFocus
        onChangeText={props.onTextChange}
        onBlur={() => setIsEditing(false)}
        style={[styles.middleInput, typo, { color }]}
      />
    );
  }

  // eventCreate: selcted / unSelected
  if(props.variant === 'eventCreate' && props.status !== 'plus') {
    const isEmpty = !props.text;

    return (
      <Pressable
        onPress={() => {
          if(props.status === 'selected') {
            setIsEditing(true);
          }
        }}
        style={styles.middlePressable}
      >
        <Text style={[typo, { color: isEmpty ? '#B0B0B0' : color }]}>
          {props.text || '할 일을 입력하세요'}
        </Text>
      </Pressable>
    );
  }

  // daily / eventView / eventCreate (plus)
  return (
    <Text style={[typo, { color }]}>
      {props.text}
    </Text>
  );
}


// # 스타일 영역
const styles = StyleSheet.create({
  // Leading
  leading: {
    flexShrink: 0,
  },
  iconPlaceholder: {
    borderRadius: 4,
  },

  // Middle
  middleInput: {
    flex: 1,
    minWidth: 0,
    padding: 0,
  },
  middlePressable: {
    flexShrink: 1,
    minWidth: 0,
    alignItems: 'flex-start',
  },

  // TODO: 실제 TDS Typography 토큰 값으로 교체
  textSmall: {
    fontSize: 14,
  },
  textMedium: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 18,
  },
});

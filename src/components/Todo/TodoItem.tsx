// src/components/Todo/TodoItem.tsx
import { useState } from 'react';
import { Pressable, View, Text, TextInput, StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { radius } from '@/theme/radius';

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
// ## Leading function
// TODO: 아이콘 구현 시 교체 필요 (현재는 테스팅 용 임시 값 지정)
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

// ## Middle function
function getMiddleTypo(variant: TodoVariant, status: TodoStatus) {
  if (variant === 'daily') {
    return typography.default.body.small;
  } else if (variant === 'eventCreate' && status === 'plus') {
    return typography.default.body.medium;
  } else {
    return typography.default.body.large;
  }
}

function getMiddleColor(status: TodoStatus): string {
  return status === 'unDone' || status === 'selected' ? colors.text.default : colors.text.disable;
}

function Middle(props: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [previousStatus, setPreviousStatus] = useState(props.status);

  // status 변경 시 이전 편집 상태 초기화
  if (previousStatus !== props.status) {
    setPreviousStatus(props.status);
    setIsEditing(false);
  }

  const typo = getMiddleTypo(props.variant, props.status);
  const color = getMiddleColor(props.status);

  // TODO: 텍스트가 길어질 때 말줄임 처리 여부 결정
  // eventCreate: selected + 편집 중
  if (props.variant === 'eventCreate' && props.status === 'selected' && isEditing) {
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

  // eventCreate: selected / unSelected
  if (props.variant === 'eventCreate' && props.status !== 'plus') {
    const isEmpty = !props.text;

    return (
      <Pressable
        onPress={() => {
          if (props.status === 'selected') {
            setIsEditing(true);
          }
        }}
        style={styles.middlePressable}
      >
        <Text style={[typo, { color: isEmpty ? colors.text.disable : color }]}>
          {props.text || '할 일을 입력하세요'}
        </Text>
      </Pressable>
    );
  }

  // daily / eventView / eventCreate (plus)
  return <Text style={[typo, { color }]}>{props.text}</Text>;
}

// ## Trailing function
function getTrailingColor(status: TodoStatus): string {
  return status === 'unDone' || status === 'selected'
    ? colors.text.additional
    : colors.text.disable;
}

function Trailing(props: TodoItemProps) {
  // plus: trailing 영역 X
  if (props.status === 'plus') {
    return null;
  }

  // daily: trailing 영역 선택
  if (props.variant === 'daily' && !props.date) {
    return null;
  }

  const color = getTrailingColor(props.status);

  // eventCreate: trailing == chipButton
  if (props.variant === 'eventCreate') {
    return (
      // TODO: 실제 ChipButton 컴포넌트 구현 후 교체
      <Pressable onPress={props.onDateClick} style={styles.trailing}>
        <Text style={[typography.default.label.medium, { color }]}>{props.date}</Text>
      </Pressable>
    );
  }

  // daily, eventView: trailing == text(date)
  return (
    <Text
      style={[
        typography.default.label.medium,
        styles.trailing,
        props.variant === 'daily' && styles.trailingDaily,
        { color },
      ]}
    >
      {props.date}
    </Text>
  );
}

// ## Layout function
function getVerticalPadding(variant: TodoVariant): number {
  if (variant === 'eventView') {
    return spacing.padding.xxsmall;
  } else if (variant === 'eventCreate') {
    return spacing.padding.small;
  } else {
    return 0;
  }
}

function getLeftGap(variant: TodoVariant): number {
  return variant === 'eventCreate' ? spacing.gap.medium : spacing.gap.small;
}

// # Main component
export default function TodoItem(props: TodoItemProps) {
  const verticalPadding = getVerticalPadding(props.variant);
  const leftGap = getLeftGap(props.variant);

  return (
    <View style={[styles.container, { paddingVertical: verticalPadding }]}>
      {/* Left: Leading + Middle */}
      <View style={[styles.left, { gap: leftGap }]}>
        <Leading {...props} />
        <Middle {...props} />
      </View>

      {/* Right: Trailing */}
      <Trailing {...props} />
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  // ## Layout
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    minWidth: 0,
  },

  // ## Leading
  leading: {
    flexShrink: 0,
  },
  iconPlaceholder: {
    borderRadius: radius.xsmall,
  },

  // ## Middle
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

  // ## Trailing
  trailing: {
    marginLeft: 'auto',
    flexShrink: 0,
  },
  trailingDaily: {
    marginLeft: spacing.margin.xxsmall,
  },
});

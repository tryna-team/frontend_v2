import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Bell, FileText, Link, MapPin, RefreshCcw, RotateCw } from 'lucide-react-native';

import Button from '@/components/Button/Button';
import Option from '@/components/Option/Option';

import { colors } from '@/theme/colors';
import { fontFamily } from '@/theme/typography';

import Title from './Title';
import Period from './Period/Period';
import Picker from './Picker/Picker';

import List from './List/List';
import Lists from './List/Lists';
import TodoList from './List/TodoList';

import useEventPeriod from './hooks/useEventPeriod';
import useEventTodo from './hooks/useEventTodo';
import useEventOption from './hooks/useEventOption';

import { formatDate, formatTime, getTimeValue, formatTodoDate } from './utils/date';

// # 상수 영역
const POPOVER_WIDTH = 219;

// TODO: 추천 API 연동 후 추천 결과가 성공적으로 생성된 경우에만 Footer 표시
// 현재는 Footer UI 확인을 위해 true로 고정
const SHOW_RECOMMENDATION_FOOTER = true;

// # 타입 영역
type EventCreateProps = {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

// # Main component
export default function EventCreate({ startDate, startTime, endDate, endTime }: EventCreateProps) {
  // # 기본 입력 상태
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [url, setUrl] = useState('');
  const [memo, setMemo] = useState('');

  // # 레이아웃 상태
  const [titleHeight, setTitleHeight] = useState(0);
  const [listLayerTop, setListLayerTop] = useState(0);

  // # Period Hook
  const {
    startDateTime,
    endDateTime,
    selectedDateTime,
    selectedPeriod,
    isAllDay,
    isTimePickerTouched,
    setSelectedPeriod,
    setIsTimePickerTouched,
    handlePeriodPress: handlePeriodPressFromHook,
    handleAllDayChange: handleAllDayChangeFromHook,
    handlePickerDateChange,
    handlePickerTimeChange,
  } = useEventPeriod({
    startDate,
    startTime,
    endDate,
    endTime,
  });

  // # Todo Hook
  const {
    todos,
    openId,
    selectedTodoDateId,
    setOpenId,
    setSelectedTodoDateId,
    handleAddTodo: handleAddTodoFromHook,
    handleChangeTodo,
    handleCopyTodo,
    handleDeleteTodo,
    handleTodoDatePress: handleTodoDatePressFromHook,
    handleTodoDateChange,
    handleTodoOpenChange,
  } = useEventTodo();

  // # Option Hook
  const {
    repeat,
    notification,
    activeModal,
    iconBackgroundColor,
    currentSections,
    setActiveModal,
    handleOpenModal: handleOpenModalFromHook,
    handleCloseModal,
  } = useEventOption();

  // # 공통 상호작용 정리 함수
  const closeTodoInteraction = () => {
    setOpenId(null);
    setSelectedTodoDateId(null);
  };

  const closePeriodInteraction = () => {
    setSelectedPeriod(null);
    setIsTimePickerTouched(false);
  };

  const closeOptionInteraction = () => {
    setActiveModal(null);
  };

  const closeAllInteractions = () => {
    closeTodoInteraction();
    closePeriodInteraction();
    closeOptionInteraction();
  };

  // # Todo 외부 탭 감지
  const outsideTap = Gesture.Tap()
    .maxDistance(10)
    .runOnJS(true)
    .onEnd((_event, success) => {
      if (success) {
        setOpenId(null);
      }
    });

  // # Title 이벤트
  const handleTitleFocus = () => {
    closeAllInteractions();
  };

  // # Period 이벤트
  const handlePeriodPress = (period: 'start' | 'end') => {
    closeTodoInteraction();
    closeOptionInteraction();

    handlePeriodPressFromHook(period);
  };

  const handleAllDayChange = (value: boolean) => {
    closeTodoInteraction();
    closeOptionInteraction();

    handleAllDayChangeFromHook(value);
  };

  // # Todo 이벤트
  const handleAddTodo = () => {
    handleAddTodoFromHook();
    closeOptionInteraction();
  };

  const handleTodoDatePress = (id: number) => {
    closeOptionInteraction();
    closePeriodInteraction();

    handleTodoDatePressFromHook(id);
  };

  const handleTodoFocus = (id: number) => {
    // 현재 Todo의 스와이프가 열려 있으면 기존 동작 유지
    if (openId !== id) {
      setOpenId(null);
    }

    setSelectedTodoDateId(null);
    closePeriodInteraction();
    closeOptionInteraction();
  };

  const handleTodoInteraction = (id: number) => {
    if (openId !== id) {
      setOpenId(null);
    }
  };

  // # Modal 이벤트
  const handleOpenModal = (modal: 'label' | 'repeat' | 'notification') => {
    closeTodoInteraction();
    closePeriodInteraction();

    handleOpenModalFromHook(modal);
  };

  // # Main UI
  return (
    <GestureDetector gesture={outsideTap}>
      <View style={styles.root}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          scrollEnabled={!isTimePickerTouched}
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
                  iconBackgroundColor={iconBackgroundColor}
                  onFocus={handleTitleFocus}
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
                      onTimeTouchStart={() => setIsTimePickerTouched(true)}
                      onTimeTouchEnd={() => setIsTimePickerTouched(false)}
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

              {/* 2. TodoList + DatePicker */}
              <View style={styles.todoSection}>
                <Lists variant="background" paddingVertical={0}>
                  {todos.map((todo) => {
                    const isDatePickerOpen = selectedTodoDateId === todo.id;

                    return (
                      <View key={todo.id} style={styles.todoWithPicker}>
                        <TodoList
                          variant="default"
                          value={todo.value}
                          onChangeText={(text) => handleChangeTodo(todo.id, text)}
                          trailingText={formatTodoDate(todo.date, startDateTime, endDateTime)}
                          isDatePickerOpen={isDatePickerOpen}
                          onTrailingPress={() => handleTodoDatePress(todo.id)}
                          onFocus={() => handleTodoFocus(todo.id)}
                          onInteraction={() => handleTodoInteraction(todo.id)}
                          onCopy={() => handleCopyTodo(todo.id)}
                          onDelete={() => handleDeleteTodo(todo.id)}
                          isOpen={openId === todo.id}
                          onOpenChange={(open) => handleTodoOpenChange(todo.id, open)}
                        />

                        {/* TodoList 바로 아래: 간격 0 */}
                        {isDatePickerOpen && (
                          <View style={styles.todoPicker}>
                            <Picker
                              variant="date"
                              date={todo.date ?? startDateTime}
                              onDateChange={(date) => handleTodoDateChange(todo.id, date)}
                            />
                          </View>
                        )}
                      </View>
                    );
                  })}

                  <TodoList variant="add" onAdd={handleAddTodo} />
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
                      icon={RefreshCcw}
                      accessibilityLabel="할 일 다시 추천받기"
                      // TODO: 추천 API 연동 후 재추천 함수 연결
                    />
                  </View>
                )}
              </View>

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
                <Pressable
                  style={StyleSheet.absoluteFill}
                  onPress={handleCloseModal}
                  accessibilityRole="button"
                  accessibilityLabel="선택 메뉴 닫기"
                />

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

  // ## TodoList + Picker
  todoSection: {
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
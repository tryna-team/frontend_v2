import {
  CalendarDays,
  ChevronLeft,
  Search,
  SquareText,
  StretchHorizontal,
  UserRound,
} from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import Button from '@/components/Button/Button';
import { Layout } from '@/components/layout';
import Toolbar from '@/components/Toolbar/Toolbar';
import CalendarHeader from '@/features/Calendar/common/CalendarHeader';
import { getMockEventDaysByMonth } from '@/features/Calendar/mockData';
import MonthlyCalendar from '@/features/Calendar/monthly/MonthlyCalendar';
import { useCalendarPageState } from '@/features/Calendar/useCalendarPageState';
import { tempDesignValues } from '@/theme/tempDesignValues';

// # 타입 영역
type HomeScreenProps = {
  // Footer "+". 일정 생성 시트를 연결할 때 넘긴다. 넘기지 않으면 눌러도 아무 일도 없다
  onPressCreate?: () => void;
};

// # 상수 영역
const { homeFooter } = tempDesignValues;
// TODO: API 연동 시 보이는 달 기준 앞뒤 M개월의 일정을 불러오는 훅으로 교체
const MOCK_EVENT_DAYS_BY_MONTH = getMockEventDaysByMonth();

// # Main component
// Figma Home/Montly (Compact·Scrolling·Menu·Detail). 월간 캘린더 화면
export default function HomeScreen({ onPressCreate }: HomeScreenProps) {
  const {
    today,
    selectedDate,
    viewMode,
    visibleMonth,
    monthListRef,
    selectDate,
    changeVisibleMonth,
    goToToday,
  } = useCalendarPageState();

  return (
    <Layout
      // TODO: Toolbar 버튼은 아직 기능을 연결하지 않는다. 보기 방식 버튼에는 ViewModeMenu를 연결할 예정
      toolbar={
        <Toolbar
          leadingIcon={ChevronLeft}
          leadingLabel={String(visibleMonth.year)}
          leadingAccessibilityLabel={`${visibleMonth.year}년 연간 캘린더`}
          trailingButtons={[
            {
              // 보기 방식 메뉴 항목과 같은 아이콘이다 (컴팩트·상세형)
              icon: viewMode === 'summary' ? StretchHorizontal : SquareText,
              accessibilityLabel: '보기 방식 선택',
            },
            { icon: Search, accessibilityLabel: '검색' },
            { icon: CalendarDays, accessibilityLabel: '캘린더' },
            { icon: UserRound, accessibilityLabel: '마이페이지' },
          ]}
        />
      }
      headerAccessory={<CalendarHeader month={visibleMonth.month} />}
      footer={
        <View style={styles.footer}>
          <Button size="large" appearance="bordered" label="오늘" onPress={goToToday} />
          <Button variant="cta" onPress={onPressCreate} />
        </View>
      }
    >
      {(mainArea) => (
        <MonthlyCalendar
          ref={monthListRef}
          mainArea={mainArea}
          viewMode={viewMode}
          today={today}
          selectedDate={selectedDate}
          eventDaysByMonth={MOCK_EVENT_DAYS_BY_MONTH}
          onSelectDate={selectDate}
          onVisibleMonthChange={changeVisibleMonth}
        />
      )}
    </Layout>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  // Figma Footer의 버튼 줄. 버튼 사이 빈 곳의 터치는 아래 달력으로 넘긴다
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: homeFooter.paddingTop,
    paddingHorizontal: homeFooter.paddingHorizontal,
    pointerEvents: 'box-none',
  },
});

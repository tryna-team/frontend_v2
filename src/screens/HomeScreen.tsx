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
import ViewModeMenu from '@/features/Calendar/monthly/ViewModeMenu';
import { useCalendarPageState } from '@/features/Calendar/useCalendarPageState';
import { tempDesignValues } from '@/theme/tempDesignValues';

// # 타입 영역
type HomeScreenProps = {
  // 날짜 칸. 누른 날짜를 선택한 뒤 부른다. 데일리 화면으로 이동할 때 넘긴다
  onPressDate?: (date: string) => void;
  // Footer "+". 일정 생성 시트를 연결할 때 넘긴다. 넘기지 않으면 눌러도 아무 일도 없다
  onPressCreate?: () => void;
};

// # 상수 영역
const { homeFooter } = tempDesignValues;
// TODO: API 연동 시 보이는 달 기준 앞뒤 M개월의 일정을 불러오는 훅으로 교체
const MOCK_EVENT_DAYS_BY_MONTH = getMockEventDaysByMonth();

// # Main component
// Figma Home/Montly (Compact·Scrolling·Menu·Detail). 월간 캘린더 화면
export default function HomeScreen({ onPressDate, onPressCreate }: HomeScreenProps) {
  const {
    today,
    selectedDate,
    viewMode,
    visibleMonth,
    isViewModeMenuOpen,
    monthListRef,
    selectDate,
    changeVisibleMonth,
    openViewModeMenu,
    closeViewModeMenu,
    changeViewMode,
    goToToday,
  } = useCalendarPageState();

  // 날짜 칸을 누르면 그 날짜를 선택하고, 넘겨받은 동작(데일리 화면 이동)을 이어서 한다
  const pressDate = (date: string) => {
    selectDate(date);
    onPressDate?.(date);
  };

  return (
    <>
      <Layout
        // TODO: 보기 방식 외의 Toolbar 버튼(연도, 검색, 캘린더, 마이페이지)은 이동할 화면이 생기면 연결한다
        toolbar={
          <Toolbar
            leadingIcon={ChevronLeft}
            leadingLabel={String(visibleMonth.year)}
            leadingAccessibilityLabel={`${visibleMonth.year}년 연간 캘린더`}
            trailingButtons={[
              {
                // 보기 방식 메뉴 항목과 같은 아이콘이다 (컴팩트·상세형)
                icon: viewMode === 'summary' ? StretchHorizontal : SquareText,
                onPress: openViewModeMenu,
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
            onSelectDate={pressDate}
            onVisibleMonthChange={changeVisibleMonth}
          />
        )}
      </Layout>

      {/* Toolbar 위에 겹쳐 띄우는 메뉴. RN Modal이라 Layout 밖에 둔다 */}
      <ViewModeMenu
        visible={isViewModeMenuOpen}
        viewMode={viewMode}
        onSelect={changeViewMode}
        onClose={closeViewModeMenu}
      />
    </>
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

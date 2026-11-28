import {
  CalendarDays,
  ChevronLeft,
  Search,
  SquareText,
  StretchHorizontal,
  UserRound,
} from 'lucide-react-native';
import { useEffect } from 'react';

import { Layout } from '@/components/layout';
import Toolbar from '@/components/Toolbar/Toolbar';
import CalendarFooter from '@/features/Calendar/common/CalendarFooter';
import CalendarHeader from '@/features/Calendar/common/CalendarHeader';
import { getMockEventDaysByMonth } from '@/features/Calendar/mockData';
import MonthlyCalendar from '@/features/Calendar/monthly/MonthlyCalendar';
import ViewModeMenu from '@/features/Calendar/monthly/ViewModeMenu';
import { useCalendarPageState } from '@/features/Calendar/useCalendarPageState';

// # 타입 영역
type HomeScreenProps = {
  // 연간 화면에서 고른 달('YYYY-MM'). 값이 들어오면 그 달로 옮기고 onTargetMonthShown을 부른다
  targetMonth?: string;
  // 그 달로 옮긴 뒤 부른다. 값을 비워야 다음에 같은 달을 다시 골라도 옮겨진다
  onTargetMonthShown?: () => void;
  // 날짜 칸. 누른 날짜를 선택한 뒤 부른다. 데일리 화면으로 이동할 때 넘긴다
  onPressDate?: (date: string) => void;
  // Toolbar의 연도 버튼. 보고 있는 달의 해를 넘긴다. 연간 화면으로 이동할 때 넘긴다
  onPressYear?: (year: number) => void;
  // Footer "+". 일정 생성 시트를 연결할 때 넘긴다. 넘기지 않으면 눌러도 아무 일도 없다
  onPressCreate?: () => void;
};

// # 상수 영역
// TODO: API 연동 시 보이는 달 기준 앞뒤 M개월의 일정을 불러오는 훅으로 교체
const MOCK_EVENT_DAYS_BY_MONTH = getMockEventDaysByMonth();

// # Main component
// Figma Home/Montly (Compact·Scrolling·Menu·Detail). 월간 캘린더 화면
export default function HomeScreen({
  targetMonth,
  onTargetMonthShown,
  onPressDate,
  onPressYear,
  onPressCreate,
}: HomeScreenProps) {
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
    showMonth,
  } = useCalendarPageState();

  // 날짜 칸을 누르면 그 날짜를 선택하고, 넘겨받은 동작(데일리 화면 이동)을 이어서 한다
  const pressDate = (date: string) => {
    selectDate(date);
    onPressDate?.(date);
  };

  // 연간 화면에서 고른 달로 옮긴다
  useEffect(() => {
    if (!targetMonth) return;

    const [year, month] = targetMonth.split('-').map(Number);
    showMonth(year, month);
    onTargetMonthShown?.();
  }, [targetMonth, showMonth, onTargetMonthShown]);

  return (
    <>
      <Layout
        // TODO: 검색, 캘린더, 마이페이지 버튼은 이동할 화면이 생기면 연결한다
        toolbar={
          <Toolbar
            leadingIcon={ChevronLeft}
            leadingLabel={String(visibleMonth.year)}
            leadingAccessibilityLabel={`${visibleMonth.year}년 연간 캘린더`}
            leadingOnPress={() => onPressYear?.(visibleMonth.year)}
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
        footer={<CalendarFooter onPressToday={goToToday} onPressCreate={onPressCreate} />}
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

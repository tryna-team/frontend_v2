import { CalendarDays, Search, UserRound } from 'lucide-react-native';
import { useRef } from 'react';

import { Layout } from '@/components/layout';
import Toolbar from '@/components/Toolbar/Toolbar';
import CalendarFooter from '@/features/Calendar/common/CalendarFooter';
import CalendarHeader from '@/features/Calendar/common/CalendarHeader';
import type { YearlyCalendarHandle } from '@/features/Calendar/CalendarType';
import YearlyCalendar from '@/features/Calendar/yearly/YearlyCalendar';
import { useCalendarStore } from '@/stores';

// # 타입 영역
type YearlyScreenProps = {
  // 처음 맨 위에 보여 줄 해. 월간 화면에서 보던 달의 해를 넘긴다. 없으면 오늘이 속한 해다
  initialYear?: number;
  // 달을 누르면 부른다. 월간 화면으로 돌아가 그 달을 보여 줄 때 넘긴다
  onPressMonth?: (year: number, month: number) => void;
  // Footer "+". 일정 생성 시트를 연결할 때 넘긴다. 넘기지 않으면 눌러도 아무 일도 없다
  onPressCreate?: () => void;
};

// # Main component
// Figma Home/Yearly·Yearly Scrolling. 연간 캘린더 화면
export default function YearlyScreen({
  initialYear,
  onPressMonth,
  onPressCreate,
}: YearlyScreenProps) {
  // 오늘. 자정이 지나거나 앱으로 돌아올 때 useTodaySync가 갱신한다
  const today = useCalendarStore((state) => state.today);
  const yearListRef = useRef<YearlyCalendarHandle>(null);

  // "오늘" 버튼. 오늘이 속한 해로 스크롤한다. 연간 화면에는 선택 표시가 없어 선택 날짜는 바꾸지 않는다
  const goToThisYear = () => {
    const [year] = today.split('-').map(Number);
    yearListRef.current?.scrollToYear(year);
  };

  return (
    <Layout
      // TODO: Toolbar 버튼(검색, 캘린더, 마이페이지)은 이동할 화면이 생기면 연결한다
      toolbar={
        <Toolbar
          trailingButtons={[
            { icon: Search, accessibilityLabel: '검색' },
            { icon: CalendarDays, accessibilityLabel: '캘린더' },
            { icon: UserRound, accessibilityLabel: '마이페이지' },
          ]}
        />
      }
      headerAccessory={<CalendarHeader calendar="yearly" />}
      footer={<CalendarFooter onPressToday={goToThisYear} onPressCreate={onPressCreate} />}
    >
      {(mainArea) => (
        <YearlyCalendar
          ref={yearListRef}
          mainArea={mainArea}
          today={today}
          initialYear={initialYear}
          onPressMonth={onPressMonth}
        />
      )}
    </Layout>
  );
}

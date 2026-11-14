import type { Ref } from 'react';

import type { CalendarEventDaySummary } from '@/apis/types';
import type { MainArea } from '@/components/layout';
import type { MonthlyViewMode } from '@/stores';

// # 데이터 타입
// 월간 캘린더 표시 방식. Figma Day Block의 Information=Compact가 'summary', Detail이 'detail'이다
// 사용자 설정으로 저장되는 값이라 settingsStore의 타입을 그대로 다시 내보낸다
export type { MonthlyViewMode };

// 달력 한 칸의 날짜. getMonthWeeks가 만든다
export type CalendarDate = {
  date: string; // 'YYYY-MM-DD'. today, selectedDate, API의 date와 그대로 비교한다
  year: number;
  month: number; // 1~12
  day: number;
  dayOfWeek: number; // 0(일)~6(토). Week Body에서 칸 위치를 정한다
  isFirstDay: boolean; // Figma FirstDay. 1일이면 칸 위에 월을 표시한다
};

// 월 목록의 한 달. getMonthList가 만든다
export type CalendarMonth = {
  key: string; // 'YYYY-MM'. 목록의 키이자 eventDaysByMonth에서 그 달의 일정을 찾는 키
  year: number;
  month: number; // 1~12
};

// 한 달 안의 한 주. 그 달의 날짜만 담으므로 첫 주와 마지막 주는 7일보다 짧을 수 있다
export type CalendarWeek = {
  year: number;
  month: number; // 1~12
  weekIndex: number; // 그 달의 몇 번째 주인지 (0부터)
  days: CalendarDate[]; // Figma Week Body의 Size는 days.length
};

// 한 칸에 그릴 일정 한 줄. getWeekEventLayout이 만든다
export type EventSlot = {
  key: string;
  // 여러 날 일정 줄은 칸끼리 위치를 맞추기 위해, 그 주에서 같은 줄에 놓인 블록 중 가장 높은 값을 쓴다
  height: number;
  block?: EventBlockProps; // 없으면 다른 칸에서 시작한 여러 날 일정이 지나가는 빈 줄
};

export type DayEventLayout = {
  slots: EventSlot[];
  eventCount: number; // 서버의 eventCount. 숨긴 일정도 포함한다
};

// # 일정 블록 타입
// Figma _Event Block의 Label Style
export type EventBlockLabelStyle = 'textOnly' | 'textAndIcon';

// 블록이 앞뒤 주(또는 달)로 이어지는 쪽. 그쪽 모서리가 직각이 된다
// Figma Edge=Left·Right에 양쪽으로 이어지는 'both'를 더했다
export type EventBlockEdge = 'none' | 'left' | 'right' | 'both';

// 라벨별 색이 정해지면 getEventBlockProps에서 이 묶음으로 넘긴다
export type EventBlockColor = {
  background: string;
  title: string;
  time: string;
  icon: string;
};

// # Props 타입
// 날짜는 모두 'YYYY-MM-DD'이고, onSelectDate를 넘기지 않으면 날짜 선택이 꺼진다.
// 일정 데이터를 넘기지 않으면 날짜만 그린다
export type EventBlockProps = {
  title: string;
  time?: string; // 'HH:mm'. detail일 때만 표시한다
  labelStyle: EventBlockLabelStyle;
  detail: boolean; // Figma Detail. 제목 2줄과 시간을 표시한다. 요약형에서는 쓰지 않는다
  fadeOverflow?: boolean; // 한 줄 제목이 넘치면 말줄임(…) 대신 끝을 흐리게 자른다. 요약형에서 쓴다
  span?: number; // 여러 날 일정이 이 주에서 차지하는 칸 수 (Figma _Event Block - Multiple)
  edge?: EventBlockEdge;
  color?: EventBlockColor;
};

export type EventsProps = {
  slots: EventSlot[];
};

// Figma _Day의 Label Style. 'numOnly'는 날짜 숫자(월간 칸), 'weekOnly'는 요일 글자(요일 줄)
export type CalendarDayProps =
  | {
      labelStyle?: 'numOnly';
      day: number;
      dayOfWeek: number; // 0(일)~6(토). 주말 색을 정한다
      isToday: boolean;
      isSelected: boolean;
    }
  | {
      labelStyle: 'weekOnly';
      dayOfWeek: number;
    };

export type DateTitleProps = {
  title: string;
  size?: 'small' | 'large'; // Figma Size. 기본은 Day Block의 'small'
  isToday?: boolean; // 오늘이 속한 기간(월)이면 강조색으로 표시한다
};

export type CalendarHeaderProps = {
  month: number; // 1~12. 화면에 보이는 달
};

export type DayBlockProps = {
  day: CalendarDate;
  viewMode: MonthlyViewMode;
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean; // 1일 칸의 월 제목을 강조할지 정한다
  eventLayout?: DayEventLayout;
  onSelectDate?: (date: string) => void;
};

export type WeekBodyProps = {
  week: CalendarWeek;
  viewMode: MonthlyViewMode;
  today: string;
  selectedDate?: string;
  eventDaysByDate?: Record<string, CalendarEventDaySummary>;
  onSelectDate?: (date: string) => void;
};

export type CalendarBodyProps = {
  year: number;
  month: number; // 1~12
  viewMode: MonthlyViewMode;
  monthlyEventDays?: CalendarEventDaySummary[]; // 그 달의 날짜별 일정 요약 (B101 monthlyEventDays)
  today: string;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
};

// 월 목록에서 화면이 직접 부르는 동작
export type MonthlyCalendarHandle = {
  // 날짜가 있는 달로 스크롤한다. 달 맨 위를 Header 바로 아래에 맞추고, 그 날짜의 주가 가려지면 보일 만큼 더 내린다
  scrollToDate: (date: string) => void;
};

export type MonthlyCalendarProps = {
  mainArea: MainArea; // Layout이 넘겨주는 메인 영역. 스크롤 여백과 Header·Footer 높이를 쓴다
  viewMode: MonthlyViewMode;
  // 처음 보여 줄 달과 월 목록 범위의 기준. 화면을 연 뒤 날짜가 바뀌어도 범위는 그대로 둔다
  today: string;
  selectedDate?: string;
  // 'YYYY-MM' → 그 달의 날짜별 일정 요약 (B101 monthlyEventDays). 없는 달은 날짜만 그린다
  eventDaysByMonth?: Partial<Record<string, CalendarEventDaySummary[]>>;
  onSelectDate?: (date: string) => void;
  // 화면에서 가장 많이 보이는 달이 바뀔 때 부른다. 헤더의 월 제목과 Toolbar의 연도에 쓴다
  onVisibleMonthChange?: (year: number, month: number) => void;
  ref?: Ref<MonthlyCalendarHandle>;
};

export type ViewModeMenuProps = {
  visible: boolean;
  onSelect: (mode: MonthlyViewMode) => void; // 항목을 누르면 부르고, 이어서 onClose로 메뉴를 닫는다
  onClose: () => void; // 바깥을 누르거나 Android 뒤로가기를 누르면 부른다
};

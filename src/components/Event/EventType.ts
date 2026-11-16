import type { GestureResponderEvent } from 'react-native';

// # 타입 영역

// 길게 누르기: 메뉴 위치를 잡을 수 있게 터치 이벤트(pageX·pageY)를 그대로 넘긴다
// 스크린 리더의 "메뉴 열기" 동작으로 열리면 터치 좌표가 없어서 event가 undefined
export type EventLongPressHandler = (event?: GestureResponderEvent) => void;

// ## _Meta: Figma State에 따라 필요한 값만 받는다
// - startToEnd: 시작 + 종료 시간 (API endTime 있음)
// - startTime: 시작 시간만 (API endTime: null)
// - allday: "하루종일" (API isAllDay: true)
// - linked: 다른 날짜 일정에 연결된 항목 (예: 8/16 생일 일정의 "선물 준비"가 8/9에 표시될 때)
export type EventMetaProps =
  | { state: 'startToEnd'; startTime: string; endTime: string }
  | { state: 'startTime'; startTime: string }
  | { state: 'allday' }
  | { state: 'linked'; linkedLabel: string }; // 예: "이벤트\n10월 3일" (줄바꿈 포함)

// ## _Title: showIcon이면 Figma Label Style=Title and Icon (24 아이콘)
export type EventTitleProps = {
  title: string;
  showIcon?: boolean;
};

// ## _List: selection이면 Figma Select=True (완료). date·time을 넘기면 Trailing 표시
export type EventListItemProps = {
  label: string; // API title
  selection?: boolean; // API actionItemStatus === 'COMPLETED'
  date?: string; // 예: '9월 1일' (API displayDate를 변환)
  time?: string; // 예: '09:00' (API displayTime을 변환)
  // 체크 토글 등. 없으면 Event의 onPress가 대신 실행된다
  onPress?: () => void;
  // Event가 넘겨준다: 항목 위를 길게 눌러도 Event 메뉴가 열리도록
  onLongPress?: EventLongPressHandler;
};

// 목록 key용 id (Menu·Option과 같은 방식). API actionItemId는 숫자라 String()으로 넘긴다
export type EventListItemData = EventListItemProps & {
  id: string;
};

// ## Lists
export type EventListProps = {
  items: EventListItemData[];
  // 항목에 onPress가 없으면 Event의 onPress로 대신한다 (항목이 터치를 가져가도 Event가 눌리도록)
  onEventPress?: () => void;
  onLongPress?: EventLongPressHandler;
};

// ## Event: title·items를 넘겼는지로 Figma Event Style이 정해진다
// - title만 → Title only / title + items → Title and List / items만 → List only
export type EventVariant = 'bordered' | 'borderless';

type EventContentProps =
  | { title: EventTitleProps; items?: EventListItemData[] }
  | { title?: never; items: EventListItemData[] };

export type EventProps = EventContentProps & {
  variant?: EventVariant;
  meta: EventMetaProps;
  onPress?: () => void;
  // 삭제·복제 메뉴는 페이지가 띄운다. Event는 길게 눌렸다는 것만 알린다
  onLongPress?: EventLongPressHandler;
};

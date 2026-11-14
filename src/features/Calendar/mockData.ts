// ⚠️ 임시 더미 일정: API 연동 전까지 화면 확인에 쓴다. API 연동 후 삭제한다
import type { CalendarEventDaySummary, CalendarEventDetail } from '@/apis/types';
import { getMonthWeeks } from './utils/monthGrid';

// # 함수 영역
// ## 더미 일정 한 건. 날짜·시간 외의 값은 기본값으로 채운다
function createEvent(
  eventId: number,
  title: string,
  startDate: string,
  options: Partial<Pick<CalendarEventDetail, 'endDate' | 'startTime' | 'isAllDay'>> = {},
): CalendarEventDetail {
  return {
    eventId,
    title,
    startDate,
    startTime: null,
    endDate: null,
    endTime: null,
    isAllDay: false,
    location: null,
    labelId: null,
    sourceType: 'USER_NATURAL_LANGUAGE',
    status: 'CONFIRMED',
    ...options,
  };
}

// # 더미 일정 (2026년 9~11월)
// 블록 종류, 주·달 경계를 넘는 여러 날 일정, 4개 초과, 칸보다 긴 제목을 모두 담는다
const MOCK_EVENTS: CalendarEventDetail[] = [
  // ## 9월
  createEvent(1, '팀 회의', '2026-09-07', { startTime: '10:00:00' }),
  createEvent(2, '개강 준비', '2026-09-15', { isAllDay: true }),
  createEvent(3, '병원 예약', '2026-09-15'),
  createEvent(4, '추석 연휴', '2026-09-24', { endDate: '2026-09-26', isAllDay: true }),
  createEvent(5, '제주 여행', '2026-09-29', { endDate: '2026-10-02' }), // 달 경계

  // ## 10월
  createEvent(6, '한글날', '2026-10-09', { isAllDay: true }),
  createEvent(7, '프로젝트 마감 주간', '2026-10-09', { endDate: '2026-10-26' }), // 4주에 걸침
  createEvent(8, '아침 운동', '2026-10-14', { startTime: '07:30:00' }),
  createEvent(9, '스터디', '2026-10-14', { startTime: '19:00:00' }), // 시간 일정 2개 (상세형은 Detail 2개)

  // ## 11월
  createEvent(10, '가을 휴가', '2026-11-01', { endDate: '2026-11-02', isAllDay: true }),
  createEvent(11, '출장', '2026-11-03', { endDate: '2026-11-05', startTime: '09:00:00' }),
  createEvent(12, '점심 약속', '2026-11-04', { startTime: '12:30:00' }),
  createEvent(13, '가을 축제', '2026-11-05', { endDate: '2026-11-07' }), // 출장과 겹쳐 두 번째 줄
  createEvent(14, '가족 모임', '2026-11-08', { isAllDay: true }),
  createEvent(15, '디자인 시스템 리뷰 회의', '2026-11-12', { startTime: '14:00:00' }), // 칸보다 긴 제목
  createEvent(16, '가을 캠핑', '2026-11-13', { endDate: '2026-11-16', isAllDay: true }), // 주 경계
  createEvent(17, '세무서 방문', '2026-11-19', { isAllDay: true }),
  createEvent(18, '독서 모임', '2026-11-19'),
  createEvent(19, '장보기', '2026-11-19'),
  createEvent(20, '세탁소', '2026-11-19'),
  createEvent(21, '택배 반품', '2026-11-19'), // 4개 초과
  createEvent(22, '화분 물주기', '2026-11-19'),
  createEvent(23, '보고서 제출', '2026-11-24'),
  createEvent(24, '치과', '2026-11-24', { startTime: '10:00:00' }),
  createEvent(25, '연말 정산 준비', '2026-11-27', { endDate: '2026-12-01' }), // 마지막 주는 양쪽으로 이어짐
];

// # 더미 응답
// v1 서버처럼 일정이 걸친 날짜마다 같은 일정을 넣어, 그 달의 날짜별 요약(B101 monthlyEventDays)을 만든다
export function getMockMonthlyEventDays(year: number, month: number): CalendarEventDaySummary[] {
  return getMonthWeeks(year, month)
    .flatMap((week) => week.days)
    .map(({ date }) => {
      const previewEvents = MOCK_EVENTS.filter(
        (event) => event.startDate <= date && date <= (event.endDate ?? event.startDate),
      );

      return {
        date,
        eventCount: previewEvents.length,
        hasEvent: previewEvents.length > 0,
        previewEvents,
      };
    })
    .filter((eventDay) => eventDay.hasEvent);
}

// ## 월 목록용 더미 응답: 'YYYY-MM' → 그 달의 날짜별 요약
// 더미 일정은 길어야 두 달에 걸치므로, 일정이 시작하는 달과 끝나는 달만 모은다
export function getMockEventDaysByMonth(): Partial<Record<string, CalendarEventDaySummary[]>> {
  const monthKeys = new Set(
    MOCK_EVENTS.flatMap((event) => [
      event.startDate.slice(0, 7),
      (event.endDate ?? event.startDate).slice(0, 7),
    ]),
  );

  return Object.fromEntries(
    [...monthKeys].map((key) => {
      const [year, month] = key.split('-').map(Number);
      return [key, getMockMonthlyEventDays(year, month)];
    }),
  );
}

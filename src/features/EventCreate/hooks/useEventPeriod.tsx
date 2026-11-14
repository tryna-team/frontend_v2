import { useState } from 'react';

import type { SelectedPeriod } from '../Period/Period';
import type { TimePickerValue } from '../Picker/TimePicker';

// # 상수 영역
const TIME_INTERVAL = 5;

// # 타입 영역
type UseEventPeriodProps = {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

type PeriodTarget = Exclude<SelectedPeriod, null>;

// # 유틸 함수

// ## 5분 단위 올림
function roundUpToFiveMinutes(date: Date): Date {
  const next = new Date(date);

  const minutes = next.getMinutes();
  const roundedMinutes = Math.ceil(minutes / TIME_INTERVAL) * TIME_INTERVAL;

  next.setMinutes(roundedMinutes, 0, 0);

  return next;
}

// ## 날짜·시간 문자열 변환
// TODO: API 날짜 형식 확정 후 문자열 파싱 대신 ISO 날짜 또는 Date 기반으로 통일
function parseDateTime(dateText: string, timeText: string): Date {
  const now = new Date();

  const dateMatch = dateText.match(/(?:(\d{4})[.-]\s*)?(\d{1,2})월\s*(\d{1,2})일/);

  const timeMatch = timeText.match(/^(\d{1,2}):(\d{2})$/);

  if (!dateMatch || !timeMatch) {
    // TODO: 잘못된 초기 날짜·시간에 대한 오류 처리 정책 확정
    return roundUpToFiveMinutes(now);
  }

  const year = dateMatch[1] ? Number(dateMatch[1]) : now.getFullYear();

  const month = Number(dateMatch[2]) - 1;
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);

  const date = new Date(year, month, day, hour, minute);

  return roundUpToFiveMinutes(date);
}

// # Main Hook
export default function useEventPeriod({
  startDate,
  startTime,
  endDate,
  endTime,
}: UseEventPeriodProps) {
  // # Period 상태
  const [startDateTime, setStartDateTime] = useState(() => parseDateTime(startDate, startTime));

  const [endDateTime, setEndDateTime] = useState(() => {
    const initialStart = parseDateTime(startDate, startTime);
    const initialEnd = parseDateTime(endDate, endTime);

    return initialEnd < initialStart ? initialStart : initialEnd;
  });

  const [selectedPeriod, setSelectedPeriod] = useState<SelectedPeriod>(null);

  const [isAllDay, setIsAllDay] = useState(false);

  // # TimePicker 터치 상태
  const [isTimePickerTouched, setIsTimePickerTouched] = useState(false);

  // # 선택된 날짜·시간
  const selectedDateTime = selectedPeriod === 'end' ? endDateTime : startDateTime;

  // # Period 함수
  const handlePeriodPress = (period: PeriodTarget) => {
    setIsTimePickerTouched(false);

    setSelectedPeriod((previous) => (previous === period ? null : period));
  };

  const handleAllDayChange = (value: boolean) => {
    setIsAllDay(value);
    setIsTimePickerTouched(false);
  };

  // # 시작·종료 시간 순서 보장
  const updatePeriod = (period: PeriodTarget, next: Date) => {
    if (period === 'start') {
      setStartDateTime(next);

      // 시작 시간이 종료 시간보다 늦어지면 종료 시간도 변경
      if (next > endDateTime) {
        setEndDateTime(new Date(next));
      }
    } else {
      setEndDateTime(next);

      // 종료 시간이 시작 시간보다 빨라지면 시작 시간도 변경
      if (next < startDateTime) {
        setStartDateTime(new Date(next));
      }
    }
  };

  // # Picker 함수

  // ## 날짜 변경
  const handlePickerDateChange = (date: Date) => {
    if (!selectedPeriod) return;

    const previous = selectedPeriod === 'start' ? startDateTime : endDateTime;

    const next = new Date(previous);

    next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());

    updatePeriod(selectedPeriod, next);
  };

  // ## 시간 변경
  const handlePickerTimeChange = (time: TimePickerValue) => {
    if (!selectedPeriod) return;

    const previous = selectedPeriod === 'start' ? startDateTime : endDateTime;

    const next = new Date(previous);

    next.setHours(time.hour, time.minute, 0, 0);

    updatePeriod(selectedPeriod, roundUpToFiveMinutes(next));
  };

  return {
    // 상태
    startDateTime,
    endDateTime,
    selectedDateTime,
    selectedPeriod,
    isAllDay,
    isTimePickerTouched,

    // 상태 변경
    setSelectedPeriod,
    setIsTimePickerTouched,

    // 이벤트 함수
    handlePeriodPress,
    handleAllDayChange,
    handlePickerDateChange,
    handlePickerTimeChange,
  };
}

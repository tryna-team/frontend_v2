import type { TimePickerValue } from '../Picker/TimePicker';

// # 상수 영역
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// # 날짜 표시
export function formatDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS[date.getDay()];

  return `${month}월 ${day}일 (${weekday})`;
}

// # 시간 표시
export function formatTime(date: Date): string {
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${hour}:${minute}`;
}

// # TimePicker 값 변환
export function getTimeValue(date: Date): TimePickerValue {
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}

// # Todo 날짜 표시
export function formatTodoDate(date: Date | null, startDate: Date, endDate: Date): string {
  if (!date) return '당일';

  // 시간 제외, 날짜만 비교
  const selected = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  const start = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  ).getTime();

  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();

  // 일정 시작일 ~ 종료일에 포함되면 당일 표시
  if (selected >= start && selected <= end) {
    return '당일';
  }

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}. ${month}. ${day}`;
}

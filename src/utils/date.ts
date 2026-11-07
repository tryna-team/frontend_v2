// 날짜 키 문자열은 기기 로컬 시간 기준으로 만든다.
// toISOString()은 UTC라 자정~오전 9시(KST)에 하루 밀리고, toLocaleDateString은 로케일 데이터에 의존한다.

// 추가 예정: toMonthKey('YYYY-MM')는 viewMonth 정책이 정해지면 월간 화면 작업 때 추가
// 추가 예정: 'YYYY-MM-DD' → Date 변환. new Date(key)는 UTC로 해석되므로 new Date(year, month - 1, day)로 만든다
// date-fns는 날짜 계산이 많아지는 캘린더 화면 작업 때 도입 검토

const pad2 = (value: number) => String(value).padStart(2, '0');

/** Date → 'YYYY-MM-DD' */
export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** 호출한 시점의 오늘 'YYYY-MM-DD'. 모듈 상수로 고정하면 날짜가 지나도 바뀌지 않으므로 매번 계산한다 */
export function getTodayKey(): string {
  return toDateKey(new Date());
}

/** 지금부터 다음 자정(기기 로컬 시간)까지 남은 밀리초. 말일·연말은 Date가 다음 달·다음 해로 넘겨준다 */
export function getMsUntilNextMidnight(now: Date = new Date()): number {
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return nextMidnight.getTime() - now.getTime();
}

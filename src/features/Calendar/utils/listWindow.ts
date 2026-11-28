// # 캘린더 목록을 당겨오는 범위
// 월간·연간 목록은 화면을 열 때 기준 날짜 주변만 만들고, 목록 끝에 가까워지면 앞뒤로 더 붙인다(당겨온다).
// 붙인 항목은 버리지 않는다. 화면에 그리는 양은 FlatList가 보이는 곳 근처로 이미 제한하고,
// 앞쪽을 버리면 버린 높이만큼 스크롤 위치를 다시 맞춰야 해서 오히려 복잡해진다

// # 상수 영역
// ## 월간 (단위: 개월)
export const MONTH_WINDOW = {
  initialRange: 12, // 화면을 열 때 기준 달(오늘이 속한 달)의 앞뒤로 만들어 두는 개월 수
  loadCount: 12, // 목록 끝에 가까워지면 한 번에 붙이는 개월 수
} as const;

// ## 연간 (단위: 년)
export const YEAR_WINDOW = {
  initialRange: 5, // 화면을 열 때 기준 해(처음 보여 줄 해)의 앞뒤로 만들어 두는 해 수
  loadCount: 5, // 목록 끝에 가까워지면 한 번에 붙이는 해 수
} as const;

// ## 붙이는 시점. 목록 끝에서 이 거리 안에 들어오면 붙인다. 보이는 영역 높이의 배수다
// FlatList의 onStartReachedThreshold·onEndReachedThreshold로 쓴다
export const LOAD_THRESHOLD = 1;

// ## 앞에 항목을 붙여도 보던 항목이 제자리에 있게 하는 FlatList 설정 (iOS·Android)
// react-native-web에는 이 기능이 없어 웹은 useKeepPositionOnPrepend가 맞춘다
export const KEEP_VISIBLE_POSITION = { minIndexForVisible: 0 } as const;

// ## 다룰 수 있는 연도. 날짜 키('YYYY-MM-DD')가 네 자리 연도를 가정한다
export const MIN_YEAR = 1000;
export const MAX_YEAR = 9999;

// # 함수 영역
// ## 목록을 그 해까지 늘릴 수 있는지
export function isSupportedYear(year: number): boolean {
  return Number.isInteger(year) && year >= MIN_YEAR && year <= MAX_YEAR;
}

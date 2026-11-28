// ⚠️ 임시 디자인 수치: 디자인 시스템 토큰이 정해지기 전까지 Figma 값을 그대로 옮겨 쓴다.
// TODO: 디자인 시스템 적용 후 토큰으로 교체하고 이 파일을 삭제

export const tempDesignValues = {
  // # 캘린더
  // ## _Title (Date=Month)
  dateTitle: {
    smallHeight: 18,
    largeHeight: 32,
  },

  // ## _Day
  calendarDay: {
    size: 34, // Calender=Montly
    weekLabelHeight: 14, // Calender=Montly, Label Style=Week only
    yearlySize: 15, // Calender=Yearly
  },

  // ## Calender Header
  // Toolbar 아래 내용의 수치. 상태바·Toolbar 영역과 배경은 Layout의 Header가 맡는다
  calendarHeader: {
    // Calender=Monthly
    paddingTop: 20, // Toolbar 아래 ~ 월 제목
    titlePaddingHorizontal: 16,
    gap: 16, // 월 제목 ~ 요일 줄
    // Calender=Yearly는 Toolbar 아래에 내용 없이 여백만 있다.
    // Figma Home/Yearly의 Header 높이(116)에서 상태바(62)와 Toolbar(44)를 뺀 값이다 (컴포넌트는 114라 8)
    yearlyHeight: 10,
  },

  // ## 월 목록 (Home/Montly의 Calender Body 프레임)
  monthList: {
    // 달 사이 간격. Compact 화면은 10, Detail 화면은 0이다
    gap: {
      summary: 10,
      detail: 0,
    },
  },

  // ## 연간 캘린더 (Home/Yearly)
  // ### YearCalender - Monthly: 연간 캘린더의 월 캘린더
  yearMonth: {
    // TODO: 디자이너 확인 이후 수정 필요
    // Figma 월 제목 높이가 22(9·11월)와 18(10월, _Title Small 기본값)로 섞여 가운데 열만 4 낮다. 모두 22로 맞춘다
    titleHeight: 22,
    titleGap: 8, // 월 제목 ~ 날짜
    dayGap: 1, // 같은 주의 날짜 칸 사이. 칸 크기는 calendarDay.yearlySize
    weekGap: 2, // 주 사이
    // TODO: 디자이너 확인 이후 수정 필요
    // Figma 예시 달은 모두 5주다. 6주인 달도 들어가도록 모든 달의 날짜 영역을 6주 높이로 고정해
    // 한 줄의 세 달과 모든 해의 높이를 같게 한다
    weekCount: 6,
  },

  // ### Calender Layer: 한 해 (연도 제목 + 월 캘린더 12개)
  yearSection: {
    headerPaddingVertical: 4, // 연도 제목 위아래. 제목 높이는 dateTitle.largeHeight
    headerPaddingHorizontal: 16,
    dividerWidth: 1, // 연도 제목 아래 구분선
    bodyPaddingTop: 16, // 구분선 ~ 첫 줄
    rowGap: 24, // 월 줄 사이
    rowPaddingHorizontal: 24,
    // 한 줄의 달 사이 최소 간격. 402 폭에서 Figma 간격과 같고, 더 넓은 화면에서는 남는 폭만큼 넓어진다
    monthGap: 10.5,
    monthsPerRow: 3,
  },

  // ### 연도 목록 (Home/Yearly의 Calender Body 프레임)
  yearList: {
    gap: 56, // 해 사이 간격
  },

  // ### 월간 ↔ 연간 화면 전환. Figma 프로토타입(연간에서 달 누르기)의 Dissolve 0.3초. 시간은 iOS만 바꿀 수 있다
  yearlyTransition: {
    duration: 300,
  },

  // ## 화면 Footer의 버튼 줄 (Home/Montly·Home/Yearly의 Footer)
  // 버튼은 아래 끝을 맞춘다("+" 52, "오늘" 50). Figma Footer의 아래 여백이 28이라
  // 버튼 아래 끝이 홈 인디케이터 영역(34) 안으로 6 들어간다
  homeFooter: {
    paddingTop: 16, // Footer 위 끝 ~ 가장 높은 버튼("+") 위 끝
    paddingHorizontal: 24,
  },

  // ## 보기 전환 메뉴 (Home/Montly Menu의 Menu)
  // 세로 위치는 Toolbar 윗변(상태바 바로 아래)과 같다
  viewModeMenu: {
    width: 250,
    right: 19, // 화면 오른쪽 끝 ~ 메뉴
  },

  // ## Day Block
  dayBlock: {
    titleGap: 4,
    // 일정 개수와 관계없이 고정한다. 월 목록의 스크롤 위치 계산이 이 값에 의존한다
    contentHeight: {
      summary: 109,
      detail: 199,
    },
    contentPaddingTop: 8,
    contentPaddingBottom: 4,
    contentGap: 8,
    dividerWidth: 1,
  },

  // ## Week Body
  weekBody: {
    paddingTop: 8,
    paddingBottom: 4,
  },

  // ## Events
  events: {
    gap: 2,
    // 블록과 칸 경계 사이 여백. 402 폭에서 Figma 블록 폭(52)과 같아진다
    inset: 2.71,
    // 칸에 다 못 그린 일정 수(+N) 줄의 높이. Figma에 없는 임시 값이라 한 줄 블록(Text only)과 같게 둔다
    moreHeight: 15,
  },

  // ## _Event Block
  // 높이는 Figma 값이다. 글꼴 토큰의 행간(15)이 Figma(13)보다 커서 글자 줄이 틀 밖으로 조금 넘친다
  eventBlock: {
    height: {
      text: 15,
      icon: 16,
      detail: 45,
    },
    detailTitleHeight: 30, // 제목 2줄 영역. 제목이 1줄이어도 높이는 같다
    detailTimeHeight: 13,
    paddingHorizontal: 2,
    paddingVertical: 1,
    edgePadding: 4.71, // Edge 변형에서 둥근 쪽 여백
    iconSize: 14,
    // 요약형에서 넘친 제목을 칩 오른쪽 끝에서 흐리게 덮는 폭. Figma에 없는 임시 값이라 디자인이 정해지면 교체
    // 칩 오른쪽 여백까지 포함한 폭이다 (일반 칩은 여백 2 + 글자 부분 12)
    fadeWidth: 14,
    // 흐림 단계. offset은 덮개 시작(0)~칩 끝(1), opacity는 배경색으로 덮는 정도(1이면 글자가 완전히 가려진다)
    // 앞쪽에서 빠르게 진해지고, 끝부분(마지막 20%)은 글자를 완전히 가린다. Figma에 없는 임시 값
    fadeStops: [
      { offset: 0, opacity: 0 },
      { offset: 0.5, opacity: 0.8 },
      { offset: 0.8, opacity: 1 },
      { offset: 1, opacity: 1 },
    ],
  },
} as const;

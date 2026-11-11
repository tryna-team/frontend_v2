// ⚠️ 임시 디자인 수치: 디자인 시스템 토큰이 정해지기 전까지 Figma 값을 그대로 옮겨 쓴다.
// TODO: 디자인 시스템 적용 후 토큰으로 교체하고 이 파일을 삭제

export const tempDesignValues = {
  // # 캘린더
  // ## _Title (Date=Month)
  dateTitle: {
    smallHeight: 18,
    largeHeight: 32,
  },

  // ## _Day (Calender=Montly)
  calendarDay: {
    size: 34,
    weekLabelHeight: 14, // Label Style=Week only
  },

  // ## Calender Header (Calender=Monthly)
  // Toolbar 아래 내용의 수치. 상태바·Toolbar 영역과 배경은 Layout의 Header가 맡는다
  calendarHeader: {
    paddingTop: 20, // Toolbar 아래 ~ 월 제목
    titlePaddingHorizontal: 16,
    gap: 16, // 월 제목 ~ 요일 줄
  },

  // ## 월 목록 (Home/Montly의 Calender Body 프레임)
  monthList: {
    // 달 사이 간격. Compact 화면은 10, Detail 화면은 0이다
    gap: {
      summary: 10,
      detail: 0,
    },
  },

  // ## 화면 Footer의 버튼 줄 (Home/Montly의 Footer)
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
  },
} as const;

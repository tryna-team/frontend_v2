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

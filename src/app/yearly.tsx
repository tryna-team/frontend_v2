import { router, useLocalSearchParams } from 'expo-router';

import YearlyScreen from '@/screens/YearlyScreen';
import { toMonthKey } from '@/utils/date';

// 연간 캘린더 화면. 월간 화면 Toolbar의 연도 버튼으로 연다 (?year=처음 보여 줄 해)
// 달을 누르면 월간 화면으로 돌아가면서 ?month=YYYY-MM으로 그 달을 넘긴다.
// 월간 화면이 스택에 없으면(웹에서 주소로 바로 연 경우) dismissTo가 지금 화면을 월간 화면으로 바꾼다
export default function YearlyRoute() {
  const { year } = useLocalSearchParams<{ year?: string }>();

  return (
    <YearlyScreen
      initialYear={year ? Number(year) : undefined}
      onPressMonth={(pressedYear, month) =>
        router.dismissTo({ pathname: '/home', params: { month: toMonthKey(pressedYear, month) } })
      }
    />
  );
}

import { router, useLocalSearchParams } from 'expo-router';

import HomeScreen from '@/screens/HomeScreen';

// 월간 캘린더 화면
// - 날짜를 누르면 데일리 화면으로 이동한다. 데일리 화면은 누른 날짜를 store의 선택 날짜(selectedDate)로 읽는다
// - Toolbar의 연도를 누르면 그 해의 연간 화면(/yearly?year=)을 연다
// - 연간 화면에서 달을 고르면 ?month=YYYY-MM으로 돌아온다. 그 달로 옮긴 뒤 파라미터를 지워,
//   다음에 같은 달을 다시 골라도 옮겨지게 한다
export default function HomeRoute() {
  const { month } = useLocalSearchParams<{ month?: string }>();

  return (
    <HomeScreen
      targetMonth={month}
      onTargetMonthShown={() => router.setParams({ month: undefined })}
      onPressDate={() => router.push('/daily')}
      onPressYear={(year) => router.push({ pathname: '/yearly', params: { year } })}
    />
  );
}

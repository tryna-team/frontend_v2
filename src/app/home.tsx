import { router } from 'expo-router';

import HomeScreen from '@/screens/HomeScreen';

// 월간 캘린더 화면. 날짜를 누르면 데일리 화면으로 이동한다
// 데일리 화면은 누른 날짜를 store의 선택 날짜(selectedDate)로 읽는다
export default function HomeRoute() {
  return <HomeScreen onPressDate={() => router.push('/daily')} />;
}

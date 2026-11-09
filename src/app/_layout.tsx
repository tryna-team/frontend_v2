import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { useAppReady } from '@/hooks/useAppReady';
import { useTodaySync } from '@/hooks/useTodaySync';
import Splash from '@/screens/Splash';

// 앱 시작 준비가 끝날 때까지 네이티브 스플래시를 유지한다. 첫 렌더보다 먼저 실행되도록 모듈 최상단에 둔다.
// 숨기는 시점은 Splash가 정한다.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isReady = useAppReady();
  useTodaySync();

  return (
    <>
      {isReady && (
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="daily" />
          <Stack.Screen name="event/[eventId]" />
        </Stack>
      )}
      {/* 앱 화면 위에 겹쳐 그린다. 디자인된 스플래시가 생기면 앱 화면 위에서 사라지는 연출을 할 수 있다 */}
      <Splash isAppReady={isReady} />
    </>
  );
}

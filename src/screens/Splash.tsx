import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

interface SplashProps {
  /** 앱 시작 준비(useAppReady)가 끝났는지 */
  isAppReady: boolean;
}

// 추가 예정: 디자인이 나오면 화면 전체를 덮는 스플래시를 그리고, 네이티브 스플래시는 이 화면이 그려진 직후(onLayout) 숨긴다
// 추가 예정: 최소 표시 시간·종료 애니메이션도 여기서 처리하고, 끝나면 null을 반환해 뒤의 앱 화면이 드러나게 한다

/**
 * 앱 시작 스플래시. 루트 레이아웃이 앱 화면 위에 겹쳐 그리며, 스플래시 처리는 이 파일에서만 한다.
 * 지금은 디자인이 없어 아무것도 그리지 않고, 네이티브 스플래시를 준비가 끝날 때까지 유지했다가 숨긴다.
 */
export default function Splash({ isAppReady }: SplashProps) {
  useEffect(() => {
    // 앱 화면이 함께 그려진 뒤에 숨겨야 빈 화면이 잠깐 보이지 않는다
    if (isAppReady) {
      SplashScreen.hide();
    }
  }, [isAppReady]);

  return null;
}

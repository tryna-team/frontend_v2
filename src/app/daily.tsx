import { Text, View, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { useCalendarStore } from '@/stores';

export default function DailyScreen() {
  // 임시 표시: 캘린더(/home)에서 누른 날짜
  const selectedDate = useCalendarStore((state) => state.selectedDate);

  // 홈(/home)이 캘린더 화면으로 바뀌어, 홈에 있던 일정 화면 테스트 버튼을 여기로 옮겼다
  const handleEventPress = () => {
    router.push({
      pathname: '/event/[eventId]',
      // 테스트용 임시 값 설정
      params: { eventId: '20261101' }
    });
  };

  return (
    <View style={styles.container}>
      <Text>Daily Screen</Text>
      <Text>Selected Date: {selectedDate}</Text>

      <Button
        title="Event"
        onPress={handleEventPress}
      />

      <Button 
        title="Back (home)" 
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            // 현재는 임시로 홈으로 이동하도록 설정
            router.replace('/home');
          }
        }} 
      /> 
    </View>
  );
}

// # style 영역
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
});

import { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Sheet from '@/components/Sheet/Sheet';
import EventCreate from '@/features/EventCreate/EventCreate';

// # Main component
export default function Index() {
  const [visible, setVisible] = useState(true);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Button
        title="일정 생성 열기"
        onPress={() => setVisible(true)}
      />

      {visible && (
        <Sheet onClose={() => setVisible(false)}>
          <EventCreate
            startDate="10월 1일 (화)"
            startTime="18:30"
            endDate="10월 1일 (화)"
            endTime="18:30"
          />
        </Sheet>
      )}
    </GestureHandlerRootView>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
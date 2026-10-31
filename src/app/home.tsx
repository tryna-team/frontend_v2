import { Text, View, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const handleEventPress = () => {
    router.push({
      pathname: '/event/[eventId]',
      // 테스트용 임시 값 설정
      params: { eventId: '20261101' }
    });
  };

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>

      <Button 
        title="Daily" 
        onPress={() => router.push('/daily')} 
      />

      <Button 
        title="Event" 
        onPress={handleEventPress} 
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

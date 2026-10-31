import { Text, View, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function DailyScreen() {
  return (
    <View style={styles.container}>
      <Text>Daily Screen</Text>

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

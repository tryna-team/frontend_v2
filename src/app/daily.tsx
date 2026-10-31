import { Text, View, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function DailyScreen() {
  return (
    <View style={styles.container}>
      <Text>Daily Screen</Text>

      <Button 
        title="Back (home)" 
        onPress={() => router.back()} 
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

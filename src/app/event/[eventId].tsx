import { Text, View, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function EventViewScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string; }>();

  return (
    <View style={styles.container}>
      <Text>Event View Screen</Text>
      <Text>Event ID: {eventId}</Text>

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

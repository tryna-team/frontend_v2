import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function EventViewScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string; }>();

  return (
    <View>
      <Text>Event View Screen</Text>
      <Text>Event ID: {eventId}</Text>
    </View>
  );
}
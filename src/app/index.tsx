
import { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import Title from '@/features/EventCreate/Title';

// # Main component
export default function Index() {
  const [title, setTitle] = useState('');
  const [completedTitle, setCompletedTitle] = useState('제목');

  return (
    <View style={styles.container}>
      {/* 1. Placeholder */}
      <View style={styles.section}>
        <Text style={styles.label}>1. Placeholder</Text>
        <Title value="" onChangeText={() => {}} />
      </View>

      {/* 2. Typing */}
      <View style={styles.section}>
        <Text style={styles.label}>2. Typing</Text>
        <Title value={title} onChangeText={setTitle} />
      </View>

      {/* 3. 입력 완료 */}
      <View style={styles.section}>
        <Text style={styles.label}>3. 입력 완료</Text>
        <Title
          value={completedTitle}
          onChangeText={setCompletedTitle}
        />
      </View>
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 40,
    backgroundColor: '#FFFFFF',
  },
  section: {
    gap: 12,
  },
  label: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#777383',
  },
});

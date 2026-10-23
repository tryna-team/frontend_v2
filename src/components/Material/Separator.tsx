import { View, StyleSheet } from 'react-native';

// # Main component
export default function Separator() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: '100%',
    height: 1,
    // TODO: TDS Semantic/Divider/Default 토큰 적용
    backgroundColor: 'rgba(28, 22, 48, 0.05)',
  },
});

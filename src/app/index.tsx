import { ScrollView } from 'react-native';

import { Layout } from '@components/layout';

export default function HomeScreen() {
  // TODO: Toolbar·Footer 콘텐츠 구현 시 null을 실제 컴포넌트로 교체 (null이어도 영역은 생성됨)
  return (
    <Layout toolbar={null} footer={null}>
      {(insets) => (
        <ScrollView
          contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        />
      )}
    </Layout>
  );
}

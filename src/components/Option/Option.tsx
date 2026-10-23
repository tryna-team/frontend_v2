
// src/components/Option/Option.tsx
import { View, Text, StyleSheet } from 'react-native';

import BG from '@/components/Material/BG';
import Separator from '@/components/Material/Separator';
import OptionItem from './OptionItem';
import { colors } from '@/theme/colors';

// # 상수 영역
const SECTION_PADDING = 8;
const SECTION_GAP = 8;
const CONTAINER_GAP = 12;

// # 타입 영역
type OptionItemData = {
  id: string;
  content: string;
  selection?: boolean;
  icon?: boolean;
  iconColor?: string;
  onPress?: () => void;
};

type OptionsData = {
  items: OptionItemData[];
};

type SectionData = {
  title?: string;
  items: OptionItemData[];
};

type OptionProps = {
  sections: SectionData[];
};

// # 함수 영역
function Options({ items }: OptionsData) {
  return (
    <View style={styles.options}>
      {items.map((item) => (
        <OptionItem
          key={item.id}
          content={item.content}
          selection={item.selection}
          icon={item.icon}
          iconColor={item.iconColor}
          onPress={item.onPress}
        />
      ))}
    </View>
  );
}

function Section({ title, items }: SectionData) {
  return (
    <View style={styles.section}>
      {title && (
        <View style={styles.sectionTitle}>
          {/* TODO: TDS Caption1 타이포그래피 적용 */}
          <Text style={styles.sectionTitleText}>{title}</Text>
        </View>
      )}

      <Options items={items} />
    </View>
  );
}

// # main component
export default function Option({ sections }: OptionProps) {
  return (
    <BG>
      <View style={styles.container}>
        {sections.map((section, index) => (
          <View key={index} style={styles.sectionGroup}>
            {index > 0 && <Separator />}
            <Section title={section.title} items={section.items} />
          </View>
        ))}
      </View>
    </BG>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 8,
    gap: CONTAINER_GAP,
  },
  sectionGroup: {
    width: '100%',
    gap: SECTION_GAP,
  },
  section: {
    width: '100%',
    paddingHorizontal: SECTION_PADDING,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: SECTION_GAP,
  },
  options: {
    width: '100%',
  },
  sectionTitle: {
    alignSelf: 'stretch',
    paddingHorizontal: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitleText: {
    color: colors.text.additional,
    fontSize: 12,
    // TODO: TDS Caption1 타이포그래피 적용
  },
});

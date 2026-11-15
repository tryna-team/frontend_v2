import { View, StyleSheet } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Scan } from 'lucide-react-native';

import Button44 from '@/components/Button/Button44/Button44';
import SearchField from './SearchField';

// # 타입 영역
type ToolbarButton = {
  icon: LucideIcon;
  onPress?: () => void;
  accessibilityLabel: string;
};

type LeadingContentProps =
  | {
      leadingIcon?: never;
      leadingLabel?: never;
      leadingAccessibilityLabel?: never;
    }
  | {
      leadingIcon: LucideIcon;
      leadingLabel?: never;
      leadingAccessibilityLabel: string;
    }
  | {
      leadingIcon?: never;
      leadingLabel: string;
      leadingAccessibilityLabel?: string;
    }
  | {
      leadingIcon: LucideIcon;
      leadingLabel: string;
      leadingAccessibilityLabel?: string;
    };

type DefaultToolbarProps = LeadingContentProps & {
  variant?: 'default';
  leadingOnPress?: () => void;
  trailingButtons?: ToolbarButton[];
};

type SearchToolbarProps = {
  variant: 'search';
  searchValue: string;
  onSearchChangeText: (text: string) => void;
  searchPlaceholder?: string;
  onSearchSubmit?: () => void;
  searchButtonOnPress: () => void;
};

type ToolbarProps = DefaultToolbarProps | SearchToolbarProps;

type LeadingProps = {
  icon?: LucideIcon;
  label?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
};

type TrailingProps = {
  buttons: ToolbarButton[];
};

type SearchProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
  onButtonPress: () => void;
};

// # 함수 영역
function Leading({
  icon,
  label,
  onPress,
  accessibilityLabel,
}: LeadingProps) {
  // 아이콘 + 텍스트
  if (icon && label) {
    return (
      <Button44
        appearance="borderless"
        icon={icon}
        label={label}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  // 아이콘
  if (icon) {
    return (
      <Button44
        appearance="borderless"
        icon={icon}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel!}
      />
    );
  }

  // 텍스트
  if (label) {
    return (
      <Button44
        appearance="borderless"
        label={label}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  return null;
}

function Trailing({ buttons }: TrailingProps) {
  return (
    <View style={styles.trailing}>
      {buttons.map(({ icon, onPress, accessibilityLabel }, index) => (
        <Button44
          key={index}
          appearance="borderless"
          icon={icon}
          onPress={onPress}
          accessibilityLabel={accessibilityLabel}
        />
      ))}
    </View>
  );
}

function Search({
  value,
  onChangeText,
  placeholder,
  onSubmitEditing,
  onButtonPress,
}: SearchProps) {
  return (
    <View style={styles.search}>
      <View style={styles.searchContainer}>
        <SearchField
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          onSubmitEditing={onSubmitEditing}
        />
      </View>

      {/* TODO: Search 전용 아이콘 확정 시 교체 */}
      <Button44
        appearance="bordered"
        shadow
        icon={Scan}
        accessibilityLabel="검색 옵션"
        onPress={onButtonPress}
      />
    </View>
  );
}

// # main component
export default function Toolbar(props: ToolbarProps) {
  if (props.variant === 'search') {
    return (
      <View style={[styles.container, styles.searchLayout]}>
        <Search
          value={props.searchValue}
          onChangeText={props.onSearchChangeText}
          placeholder={props.searchPlaceholder}
          onSubmitEditing={props.onSearchSubmit}
          onButtonPress={props.searchButtonOnPress}
        />
      </View>
    );
  }

  const {
    leadingIcon,
    leadingLabel,
    leadingOnPress,
    leadingAccessibilityLabel,
    trailingButtons = [],
  } = props;

  const showLeading = !!leadingIcon || !!leadingLabel;
  const showTrailing = trailingButtons.length > 0;

  return (
    <View style={styles.container}>
      {showLeading && (
        <Leading
          icon={leadingIcon}
          label={leadingLabel}
          onPress={leadingOnPress}
          accessibilityLabel={leadingAccessibilityLabel}
        />
      )}

      {showTrailing && <Trailing buttons={trailingButtons} />}
    </View>
  );
}

// # 스타일 영역
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  searchLayout: {
    height: 48,
  },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    minWidth: 0,
  },
});

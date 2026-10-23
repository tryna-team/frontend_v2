// # OptionItem 타입
export type LeadingProps = {
  selection?: boolean;
  icon?: boolean;
  iconColor?: string;
};

export type MiddleProps = {
  content: string;
};

export type OptionItemProps = LeadingProps &
  MiddleProps & {
    onPress?: () => void;
  };

// # Option 타입
export type OptionItemData = OptionItemProps & {
  id: string;
};

export type OptionsData = {
  items: OptionItemData[];
};

export type SectionData = {
  title?: string;
  items: OptionItemData[];
};

export type OptionProps = {
  sections: SectionData[];
};

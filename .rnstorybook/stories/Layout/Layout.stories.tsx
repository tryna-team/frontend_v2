
import type { Meta, StoryObj } from '@storybook/react-native';
import { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CalendarDays, Plus, ChevronLeft } from 'lucide-react-native';

import { Layout } from '../../../src/components/layout';

// # 타입 영역
type LayoutStoryProps = {
  showHeader: boolean;
  showFooter: boolean;
  showAccessory: boolean;
  itemCount: number;
  showBlurContent: boolean;
};

// # 상수 영역
const ITEM_HEIGHT = 72;

// # 함수 영역
function StoryToolbar() {
  return (
    <View style={styles.toolbar}>
      <ChevronLeft size={24} color="#1C1630" />

      <Text style={styles.toolbarTitle}>
        Layout Preview
      </Text>

      <CalendarDays size={24} color="#1C1630" />
    </View>
  );
}

function StoryHeaderAccessory() {
  return (
    <View style={styles.accessory}>
      <Text style={styles.accessoryTitle}>2026년 11월</Text>
      <Text style={styles.accessoryDescription}>
        HeaderAccessory 영역
      </Text>
    </View>
  );
}

function StoryFooter() {
  return (
    <View style={styles.footer}>
      <Pressable
        style={styles.footerButton}
        onPress={() => console.log('Footer Pressed')}
        accessibilityRole="button"
        accessibilityLabel="일정 추가"
      >
        <Plus size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

function StoryContentItem({
  index,
  showBlurContent,
}: {
  index: number;
  showBlurContent: boolean;
}) {
  return (
    <View
      style={[
        styles.contentItem,
        showBlurContent && styles.blurContentItem,
      ]}
    >
      <Text style={styles.contentTitle}>
        콘텐츠 {index + 1}
      </Text>

      <Text style={styles.contentDescription}>
        Main 영역의 스크롤 및 레이아웃 확인
      </Text>
    </View>
  );
}

function LayoutPreview({
  showHeader,
  showFooter,
  showAccessory,
  itemCount,
  showBlurContent,
}: LayoutStoryProps) {
  const items = useMemo(
    () => Array.from({ length: itemCount }, (_, index) => index),
    [itemCount],
  );

  return (
    <SafeAreaProvider style={styles.safeAreaProvider}>
      <Layout
        toolbar={showHeader ? <StoryToolbar /> : undefined}
        headerAccessory={
          showHeader && showAccessory
            ? <StoryHeaderAccessory />
            : undefined
        }
        footer={showFooter ? <StoryFooter /> : undefined}
      >
        {(main) => (
          <ScrollView
            style={styles.scrollView}
            {...main.scrollProps}
            showsVerticalScrollIndicator
          >
            <View style={styles.content}>
              <Text style={styles.mainTitle}>
                Main Area
              </Text>

              <Text style={styles.mainDescription}>
                Header/Footer는 Main 위에 오버레이로 배치됩니다.
              </Text>

              {items.map((index) => (
                <StoryContentItem
                  key={index}
                  index={index}
                  showBlurContent={showBlurContent}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </Layout>
    </SafeAreaProvider>
  );
}

// # Storybook 설정
const meta = {
  title: 'Components/Layout/Layout',
  component: LayoutPreview,

  argTypes: {
    showHeader: {
      control: 'boolean',
      description: 'Header 표시 여부',
    },
    showFooter: {
      control: 'boolean',
      description: 'Footer 표시 여부',
    },
    showAccessory: {
      control: 'boolean',
      description: 'HeaderAccessory 표시 여부',
    },
    itemCount: {
      control: {
        type: 'range',
        min: 0,
        max: 30,
        step: 1,
      },
      description: 'Main 콘텐츠 개수',
    },
    showBlurContent: {
      control: 'boolean',
      description: 'Blur 확인용 콘텐츠 배경 적용',
    },
  },

  args: {
    showHeader: true,
    showFooter: true,
    showAccessory: false,
    itemCount: 8,
    showBlurContent: false,
  },

  decorators: [
    (Story) => (
      <View style={styles.preview}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof LayoutPreview>;

export default meta;

// # Story 영역
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutHeader: Story = {
  args: {
    showHeader: false,
  },
};

export const WithoutFooter: Story = {
  args: {
    showFooter: false,
  },
};

export const MainOnly: Story = {
  args: {
    showHeader: false,
    showFooter: false,
  },
};

export const WithHeaderAccessory: Story = {
  args: {
    showAccessory: true,
  },
};

export const LongContent: Story = {
  args: {
    itemCount: 30,
  },
};

export const WithBlurContent: Story = {
  args: {
    showBlurContent: true,
    itemCount: 20,
  },
};

export const CustomContent: Story = {
  args: {
    itemCount: 3,
  },
};

// # 스타일 영역
const styles = StyleSheet.create({
  preview: {
    width: '100%',
    flex: 1,
    backgroundColor: '#E8E8ED',
  },

  safeAreaProvider: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  // ## Toolbar
  toolbar: {
    height: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  toolbarTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1630',
  },

  // ## HeaderAccessory
  accessory: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },

  accessoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1630',
  },

  accessoryDescription: {
    fontSize: 13,
    color: '#777580',
  },

  // ## Footer
  footer: {
    height: 62,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  footerButton: {
    width: 52,
    height: 52,
    borderRadius: 24,
    backgroundColor: '#1C1630',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ## Main
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },

  mainTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1C1630',
  },

  mainDescription: {
    fontSize: 13,
    color: '#777580',
    marginBottom: 8,
  },

  contentItem: {
    height: ITEM_HEIGHT,
    borderRadius: 12,
    backgroundColor: '#F5F5F7',
    padding: 16,
    justifyContent: 'center',
    gap: 6,
  },

  blurContentItem: {
    backgroundColor: '#FFB98A',
  },

  contentTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1C1630',
  },

  contentDescription: {
    fontSize: 12,
    color: '#777580',
  },
});

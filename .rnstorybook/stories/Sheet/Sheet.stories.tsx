import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import Sheet from '../../../src/components/Sheet/Sheet';

// # 타입 영역
type SheetStoryProps = {
  initialOpen?: boolean;
  showCloseButton?: boolean;
  content?: 'empty' | 'default' | 'long';
};

// # 함수 영역
function SheetPreview({
  initialOpen = true,
  showCloseButton = true,
  content = 'default',
}: SheetStoryProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const renderContent = () => {
    if (content === 'empty') {
      return null;
    }

    if (content === 'long') {
      return (
        <View style={styles.content}>
          <Text style={styles.title}>Sheet 콘텐츠</Text>

          <Text style={styles.description}>
            Sheet 내부에 여러 콘텐츠가 배치되는 경우를 확인합니다.
          </Text>

          {Array.from({ length: 8 }, (_, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemText}>
                항목 {index + 1}
              </Text>
            </View>
          ))}
        </View>
      );
    }

    return (
      <View style={styles.content}>
        <Text style={styles.title}>Sheet</Text>

        <Text style={styles.description}>
          기본 Sheet 컴포넌트입니다.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.preview}>
      <Pressable
        style={styles.openButton}
        onPress={() => setIsOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="시트 열기"
      >
        <Text style={styles.openButtonText}>
          Sheet 열기
        </Text>
      </Pressable>

      {isOpen && (
        <Sheet
          showCloseButton={showCloseButton}
          onClose={() => setIsOpen(false)}
        >
          {renderContent()}
        </Sheet>
      )}
    </View>
  );
}

// # 상수 영역
const meta = {
  title: 'Components/Sheet/Sheet',
  component: SheetPreview,

  argTypes: {
    initialOpen: {
      control: 'boolean',
      description: 'Story 최초 렌더링 시 Sheet 표시 여부',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Sheet 닫기 버튼 표시 여부',
    },
    content: {
      control: 'select',
      options: ['empty', 'default', 'long'],
      description: 'Sheet 내부 콘텐츠 유형',
    },
  },

  args: {
    initialOpen: true,
    showCloseButton: true,
    content: 'default',
  },
} satisfies Meta<typeof SheetPreview>;

export default meta;

// # Story 영역
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    content: 'empty',
  },
};

export const WithContent: Story = {
  args: {
    content: 'long',
  },
};

export const WithoutCloseButton: Story = {
  args: {
    showCloseButton: false,
  },
};

export const InitiallyClosed: Story = {
  args: {
    initialOpen: false,
  },
};

// # 스타일 영역
const styles = StyleSheet.create({
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  openButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1C1630',
  },

  openButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1630',
  },

  description: {
    fontSize: 15,
    color: '#777580',
  },

  item: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  itemText: {
    fontSize: 15,
    color: '#1C1630',
  },
});
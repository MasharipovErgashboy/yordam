import React, { useRef } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ScrollViewInstance } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AI_COLORS, CATEGORY_META } from '../../constants/aiChatTheme';
import type { Conversation } from '../../types/aiChat';
import { ChatInputBar } from '../../components/AiChat/ChatInputBar';
import { ChatMessageItem } from '../../components/AiChat/ChatMessageItem';
import { HeaderIconButton } from '../../components/AiChat/HeaderIconButton';
import { TypingIndicator } from '../../components/AiChat/TypingIndicator';

interface Props {
  conversation: Conversation;
  isTyping: boolean;
  onSend: (text: string) => void;
  onToggleLike: (messageId: string) => void;
  onBack: () => void;
  onNewChat: () => void;
  onOpenHistory: () => void;
  topInset: number;
  bottomInset: number;
}

export const AiConversationView: React.FC<Props> = ({
  conversation,
  isTyping,
  onSend,
  onToggleLike,
  onBack,
  onNewChat,
  onOpenHistory,
  topInset,
  bottomInset,
}) => {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const meta = CATEGORY_META[conversation.categoryId];
  const lastIndex = conversation.messages.length - 1;

  const openMenu = () =>
    Alert.alert('Suhbat', undefined, [
      { text: 'Yangi suhbat', onPress: onNewChat },
      { text: 'Suhbatlar tarixi', onPress: onOpenHistory },
      { text: 'Bekor qilish', style: 'cancel' },
    ]);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 8 }]}>
        <HeaderIconButton onPress={onBack} accessibilityLabel="Orqaga">
          <Ionicons name="chevron-back" size={20} color={AI_COLORS.text} />
        </HeaderIconButton>

        <View style={styles.avatar}>
          <MaterialCommunityIcons name="scale-balance" size={22} color="#FFFFFF" />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>AI yordamchi</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {meta.topicLabel} · {conversation.topicTitle}
          </Text>
        </View>

        <HeaderIconButton onPress={openMenu} accessibilityLabel="Qo‘shimcha amallar">
          <Ionicons name="ellipsis-vertical" size={18} color={AI_COLORS.text} />
        </HeaderIconButton>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        <View style={styles.datePill}>
          <Text style={styles.datePillText}>{conversation.dateLabel}</Text>
        </View>

        {conversation.messages.map((message, index) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            isLast={index === lastIndex && !isTyping}
            onToggleLike={onToggleLike}
            onSuggestion={(text) => {
              if (!isTyping) onSend(text);
            }}
          />
        ))}

        {isTyping && <TypingIndicator />}
      </ScrollView>

      <ChatInputBar
        placeholder="Xabar yozing..."
        leftIcon="attach"
        onLeftPress={() =>
          Alert.alert('Fayl biriktirish', 'Fayl yuklash funksiyasi tez orada ishga tushadi.')
        }
        onSend={onSend}
        sendDisabled={isTyping}
        bottomInset={bottomInset}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AI_COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: AI_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: AI_COLORS.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: AI_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AI_COLORS.navy,
  },
  headerSubtitle: {
    fontSize: 12,
    color: AI_COLORS.textSecondary,
    marginTop: 1,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  datePill: {
    alignSelf: 'center',
    backgroundColor: '#E6ECF5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
  },
  datePillText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#475569',
  },
});

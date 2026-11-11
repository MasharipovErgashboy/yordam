import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AI_COLORS } from '../../constants/aiChatTheme';
import { SEED_CONVERSATIONS } from '../../data/aiChatMock';
import { sendAiMessage } from '../../services/aiChatService';
import type {
  AiFilterId,
  AiQuickQuestion,
  AiReply,
  ChatMessage,
  Conversation,
  ConversationCategoryId,
} from '../../types/aiChat';
import { AiWelcomeView } from './AiWelcomeView';
import { AiConversationView } from './AiConversationView';
import { AiHistoryView } from './AiHistoryView';

type AiView = 'welcome' | 'chat' | 'history';

const ERROR_REPLY: AiReply = {
  text: 'Javob olishda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.',
};

let idCounter = 0;
const newId = (prefix: string) => `${prefix}-${Date.now()}-${++idCounter}`;

const formatTime = (date: Date) =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

const shorten = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

interface Props {
  onBack: () => void;
}

export const AiChatScreen: React.FC<Props> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [stack, setStack] = useState<AiView[]>(['welcome']);
  const [conversations, setConversations] = useState<Conversation[]>(SEED_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<AiFilterId>('all');
  const [typingId, setTypingId] = useState<string | null>(null);

  const view = stack[stack.length - 1];
  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  const push = (next: AiView) => setStack((s) => [...s, next]);

  const goBack = useCallback(() => {
    if (stack.length > 1) {
      setStack((s) => s.slice(0, -1));
    } else {
      onBack();
    }
  }, [stack.length, onBack]);

  // Android "orqaga" tugmasi ekranlar bo‘yicha orqaga qaytaradi
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });
    return () => sub.remove();
  }, [goBack]);

  const updateConversation = (id: string, update: (c: Conversation) => Conversation) =>
    setConversations((list) => list.map((c) => (c.id === id ? update(c) : c)));

  const requestReply = async (conversationId: string, text: string) => {
    setTypingId(conversationId);
    let reply: AiReply;
    let isError = false;
    try {
      reply = await sendAiMessage({ conversationId, text });
    } catch {
      reply = ERROR_REPLY;
      isError = true;
    }
    const aiMessage: ChatMessage = {
      id: newId('ai'),
      role: 'ai',
      time: formatTime(new Date()),
      reply,
      isError,
    };
    updateConversation(conversationId, (c) => ({
      ...c,
      messages: [...c.messages, aiMessage],
      preview: isError ? c.preview : reply.text.replace(/\*\*/g, ''),
      ...(reply.topic && !isError
        ? { categoryId: reply.topic.categoryId, topicTitle: reply.topic.title }
        : null),
    }));
    setTypingId((current) => (current === conversationId ? null : current));
  };

  const startConversation = (text: string, categoryId?: ConversationCategoryId) => {
    const now = new Date();
    const time = formatTime(now);
    const id = newId('conv');
    const conversation: Conversation = {
      id,
      title: shorten(text, 40),
      preview: text,
      categoryId: categoryId ?? 'umumiy',
      topicTitle: shorten(text, 32),
      group: 'Bugun',
      timeLabel: time,
      dateLabel: `Bugun, ${time}`,
      messages: [{ id: newId('user'), role: 'user', text, time }],
    };
    setConversations((list) => [conversation, ...list]);
    setActiveId(id);
    push('chat');
    requestReply(id, text);
  };

  const sendInActive = (text: string) => {
    if (!activeId || typingId === activeId) return;
    const userMessage: ChatMessage = {
      id: newId('user'),
      role: 'user',
      text,
      time: formatTime(new Date()),
    };
    updateConversation(activeId, (c) => ({ ...c, messages: [...c.messages, userMessage] }));
    requestReply(activeId, text);
  };

  const toggleLike = (messageId: string) => {
    if (!activeId) return;
    updateConversation(activeId, (c) => ({
      ...c,
      messages: c.messages.map((m) =>
        m.id === messageId && m.role === 'ai' ? { ...m, liked: !m.liked } : m
      ),
    }));
  };

  const openConversation = (id: string) => {
    setActiveId(id);
    push('chat');
  };

  const newChat = () => {
    setActiveId(null);
    setStack(['welcome']);
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <StatusBar style="dark" />

      {view === 'welcome' && (
        <AiWelcomeView
          filter={filter}
          onFilterChange={setFilter}
          onAskQuestion={(q: AiQuickQuestion) => startConversation(q.text, q.categoryId)}
          onSend={(text) => startConversation(text, filter === 'all' ? undefined : filter)}
          onOpenHistory={() => push('history')}
          onBack={goBack}
          topInset={insets.top}
          bottomInset={insets.bottom}
        />
      )}

      {view === 'chat' && activeConversation && (
        <AiConversationView
          conversation={activeConversation}
          isTyping={typingId === activeConversation.id}
          onSend={sendInActive}
          onToggleLike={toggleLike}
          onBack={goBack}
          onNewChat={newChat}
          onOpenHistory={() => push('history')}
          topInset={insets.top}
          bottomInset={insets.bottom}
        />
      )}

      {view === 'history' && (
        <AiHistoryView
          conversations={conversations}
          onOpen={openConversation}
          onNewChat={newChat}
          onBack={goBack}
          topInset={insets.top}
          bottomInset={insets.bottom}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AI_COLORS.bg,
  },
});

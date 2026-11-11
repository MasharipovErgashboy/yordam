import React from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AI_COLORS } from '../../constants/aiChatTheme';
import type { ChatMessage } from '../../types/aiChat';

/** "**qalin**" bo‘laklarini qalin matnga aylantiradi */
const renderRichText = (text: string) =>
  text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <Text key={i} style={styles.bold}>
          {part.slice(2, -2)}
        </Text>
      ) : (
        <Text key={i}>{part}</Text>
      )
    );

const comingSoon = (title: string) => Alert.alert(title, 'Bu funksiya tez orada ishga tushadi.');

interface Props {
  message: ChatMessage;
  isLast: boolean;
  onToggleLike: (messageId: string) => void;
  onSuggestion: (text: string) => void;
}

export const ChatMessageItem: React.FC<Props> = ({ message, isLast, onToggleLike, onSuggestion }) => {
  if (message.role === 'user') {
    return (
      <View style={styles.userBubble}>
        <Text style={styles.userText}>{message.text}</Text>
      </View>
    );
  }

  const { reply } = message;

  return (
    <View style={styles.aiWrap}>
      <View style={styles.aiCard}>
        <Text style={[styles.aiText, message.isError && styles.aiErrorText]}>
          {renderRichText(reply.text)}
        </Text>

        {reply.steps && reply.steps.length > 0 && (
          <View style={styles.stepsBox}>
            {reply.stepsTitle ? <Text style={styles.stepsTitle}>{reply.stepsTitle}</Text> : null}
            {reply.steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        )}

        {reply.sources && reply.sources.length > 0 && (
          <View style={styles.sourcesRow}>
            {reply.sources.map((source) => {
              const url = source.url;
              return (
                <TouchableOpacity
                  key={source.label}
                  style={styles.sourceChip}
                  activeOpacity={url ? 0.7 : 1}
                  disabled={!url}
                  onPress={url ? () => Linking.openURL(url) : undefined}
                  accessibilityRole={url ? 'link' : 'text'}
                >
                  <Ionicons
                    name={source.kind === 'link' ? 'link-outline' : 'book-outline'}
                    size={12}
                    color={AI_COLORS.primary}
                  />
                  <Text style={styles.sourceText}>{source.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => comingSoon('Nusxa olish')}
            accessibilityRole="button"
            accessibilityLabel="Javobdan nusxa olish"
          >
            <Ionicons name="copy-outline" size={17} color={AI_COLORS.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => comingSoon('Ovozli o‘qish')}
            accessibilityRole="button"
            accessibilityLabel="Javobni ovozli eshitish"
          >
            <Ionicons name="volume-medium-outline" size={18} color={AI_COLORS.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => onToggleLike(message.id)}
            accessibilityRole="button"
            accessibilityLabel="Javob foydali bo‘ldi"
            accessibilityState={{ selected: !!message.liked }}
          >
            <Ionicons
              name={message.liked ? 'thumbs-up' : 'thumbs-up-outline'}
              size={17}
              color={message.liked ? AI_COLORS.primary : AI_COLORS.icon}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <Text style={styles.timeText}>{message.time}</Text>
        </View>
      </View>

      {reply.action && (
        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.85}
          onPress={() => comingSoon(reply.action!.title)}
          accessibilityRole="button"
        >
          <View style={styles.actionCardIcon}>
            <MaterialCommunityIcons name="file-plus-outline" size={20} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionCardTitle}>{reply.action.title}</Text>
            <Text style={styles.actionCardSubtitle}>{reply.action.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={AI_COLORS.amberText} />
        </TouchableOpacity>
      )}

      {isLast && reply.suggestions && reply.suggestions.length > 0 && (
        <View style={styles.suggestionsRow}>
          {reply.suggestions.map((s) => (
            <TouchableOpacity
              key={s}
              style={styles.suggestionChip}
              activeOpacity={0.7}
              onPress={() => onSuggestion(s)}
              accessibilityRole="button"
            >
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontWeight: '700',
    color: AI_COLORS.text,
  },
  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '82%',
    backgroundColor: AI_COLORS.primary,
    borderRadius: 18,
    borderBottomRightRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 12,
  },
  userText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  aiWrap: {
    marginBottom: 12,
  },
  aiCard: {
    backgroundColor: AI_COLORS.surface,
    borderRadius: 18,
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    padding: 14,
  },
  aiText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#1E293B',
  },
  aiErrorText: {
    color: '#B91C1C',
  },
  stepsBox: {
    backgroundColor: AI_COLORS.bg,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  stepsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AI_COLORS.text,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  stepNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: AI_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#1E293B',
  },
  sourcesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  sourceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: AI_COLORS.primarySoft,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  sourceText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: AI_COLORS.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: AI_COLORS.surfaceMuted,
  },
  actionIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 11,
    color: AI_COLORS.textSecondary,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: AI_COLORS.amberSoft,
    borderWidth: 1,
    borderColor: AI_COLORS.amberBorder,
    borderRadius: 16,
    padding: 12,
    marginTop: 10,
  },
  actionCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: AI_COLORS.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AI_COLORS.text,
  },
  actionCardSubtitle: {
    fontSize: 12,
    color: '#6B5B3E',
    marginTop: 2,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  suggestionChip: {
    backgroundColor: AI_COLORS.surface,
    borderWidth: 1,
    borderColor: '#C9D8F5',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '500',
    color: AI_COLORS.primary,
  },
});

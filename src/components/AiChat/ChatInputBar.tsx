import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AI_COLORS } from '../../constants/aiChatTheme';

interface Props {
  placeholder: string;
  leftIcon: 'add' | 'attach';
  onLeftPress: () => void;
  onSend: (text: string) => void;
  /** Matn bo‘sh bo‘lsa yuborish o‘rniga mikrofon tugmasi ko‘rsatiladi */
  micWhenEmpty?: boolean;
  onMicPress?: () => void;
  sendDisabled?: boolean;
  bottomInset: number;
  footerNote?: string;
}

export const ChatInputBar: React.FC<Props> = ({
  placeholder,
  leftIcon,
  onLeftPress,
  onSend,
  micWhenEmpty = false,
  onMicPress,
  sendDisabled = false,
  bottomInset,
  footerNote,
}) => {
  const [text, setText] = useState('');
  const hasText = text.trim().length > 0;
  const showMic = micWhenEmpty && !hasText;
  const canSend = hasText && !sendDisabled;

  const handleRightPress = () => {
    if (showMic) {
      onMicPress?.();
      return;
    }
    if (!canSend) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(bottomInset, 10) }]}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.leftButton}
          onPress={onLeftPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={leftIcon === 'add' ? 'Fayl yoki rasm qo‘shish' : 'Fayl biriktirish'}
        >
          <Ionicons name={leftIcon} size={leftIcon === 'add' ? 22 : 20} color={AI_COLORS.icon} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={AI_COLORS.placeholder}
          multiline
          maxLength={2000}
          accessibilityLabel={placeholder}
        />

        <TouchableOpacity
          style={[styles.rightButton, !showMic && !canSend && styles.rightButtonDisabled]}
          onPress={handleRightPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={showMic ? 'Ovozli xabar' : 'Yuborish'}
          accessibilityState={{ disabled: !showMic && !canSend }}
        >
          <Ionicons name={showMic ? 'mic' : 'arrow-forward'} size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {footerNote ? <Text style={styles.footerNote}>{footerNote}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AI_COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: AI_COLORS.border,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  leftButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AI_COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    backgroundColor: AI_COLORS.bg,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 11,
    paddingBottom: 11,
    fontSize: 14,
    color: AI_COLORS.text,
    textAlignVertical: 'center',
  },
  rightButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: AI_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightButtonDisabled: {
    opacity: 0.5,
  },
  footerNote: {
    fontSize: 11,
    lineHeight: 15,
    color: AI_COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
  },
});

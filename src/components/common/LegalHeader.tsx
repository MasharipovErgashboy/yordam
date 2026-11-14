import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { ArrowLeftIcon, CloseIcon, BookmarkIcon } from './Icons';
import { Badge } from './Badge';

interface LegalHeaderProps {
  title: string;
  badgeText?: string;
  showBack?: boolean;
  showClose?: boolean;
  showBookmark?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  onBookmark?: () => void;
}

export const LegalHeader: React.FC<LegalHeaderProps> = ({
  title,
  badgeText,
  showBack = false,
  showClose = true,
  showBookmark = false,
  onBack,
  onClose,
  onBookmark,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftRow}>
        {showBack && (
          <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.actionBtn}>
            <ArrowLeftIcon size={22} color={Colors.primary} />
          </TouchableOpacity>
        )}
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {badgeText && (
          <Badge label={badgeText} variant="blue" style={styles.badge} />
        )}
      </View>

      <View style={styles.rightRow}>
        {showBookmark && (
          <TouchableOpacity activeOpacity={0.7} onPress={onBookmark} style={styles.actionBtn}>
            <BookmarkIcon size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
        {showClose && (
          <TouchableOpacity activeOpacity={0.7} onPress={onClose} style={styles.actionBtn}>
            <CloseIcon size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  leftRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 8,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.primary,
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightBlueBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

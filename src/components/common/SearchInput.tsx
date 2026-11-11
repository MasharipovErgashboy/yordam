import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '../../theme/colors';
import { SearchIcon, FilterIcon } from './Icons';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Tashkilot, xizmat yoki manzil qidiring...',
  onFilterPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <SearchIcon size={18} color={Colors.secondaryText} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.secondaryText}
        style={styles.input}
      />
      {onFilterPress && (
        <TouchableOpacity activeOpacity={0.7} onPress={onFilterPress} style={styles.filterBtn}>
          <FilterIcon size={18} color={Colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 8,
    paddingVertical: 0,
  },
  filterBtn: {
    padding: 6,
    marginLeft: 4,
  },
});

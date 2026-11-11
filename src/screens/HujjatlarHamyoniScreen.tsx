import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from './HujjatlarHamyoni/HomeScreen';
import DocumentsScreen from './HujjatlarHamyoni/DocumentsScreen';
import UploadScreen from './HujjatlarHamyoni/UploadScreen';
import DetailsScreen from './HujjatlarHamyoni/DetailsScreen';
import AIScreen from './HujjatlarHamyoni/AIScreen';
import RemindersScreen from './HujjatlarHamyoni/RemindersScreen';
import LegalScreen from './HujjatlarHamyoni/LegalScreen';
import ProfileScreen from './HujjatlarHamyoni/ProfileScreen';

export type HujjatlarHamyoniStackParamList = {
  Home: undefined;
  Documents: undefined;
  Upload: undefined;
  Details: { docId: string };
  AI: undefined;
  Reminders: undefined;
  Legal: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<HujjatlarHamyoniStackParamList>();

interface HujjatlarHamyoniScreenProps {
  onBack: () => void;
}

export const HujjatlarHamyoniScreen: React.FC<HujjatlarHamyoniScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Mini-App Top Return Bar */}
      <View style={[styles.topReturnBar, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
          <Text style={styles.backText}>Asosiy ilovaga qaytiş</Text>
        </TouchableOpacity>
      </View>

      <NavigationIndependentTree>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Documents" component={DocumentsScreen} />
            <Stack.Screen name="Upload" component={UploadScreen} />
            <Stack.Screen name="Details" component={DetailsScreen as any} />
            <Stack.Screen name="AI" component={AIScreen} />
            <Stack.Screen name="Reminders" component={RemindersScreen} />
            <Stack.Screen name="Legal" component={LegalScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </NavigationIndependentTree>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5FB',
  },
  topReturnBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  backText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
});

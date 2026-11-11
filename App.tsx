import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import HomeScreen from './src/screens/HomeScreen';
import DocumentsScreen from './src/screens/DocumentsScreen';
import UploadScreen from './src/screens/UploadScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import AIScreen from './src/screens/AIScreen';
import RemindersScreen from './src/screens/RemindersScreen';
import LegalScreen from './src/screens/LegalScreen';
import ProfileScreen from './src/screens/ProfileScreen';

type RootStackParamList = {
  Home: undefined;
  Documents: undefined;
  Upload: undefined;
  Details: { docId: string };
  AI: undefined;
  Reminders: undefined;
  Legal: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Documents" component={DocumentsScreen} />
          <Stack.Screen name="Upload" component={UploadScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="AI" component={AIScreen} />
          <Stack.Screen name="Reminders" component={RemindersScreen} />
          <Stack.Screen name="Legal" component={LegalScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

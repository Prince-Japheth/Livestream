import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import useAuthStore from './src/store/authStore';

// Only import and enable screens for native platforms
if (Platform.OS !== 'web') {
  const { enableScreens } = require('react-native-screens');
  enableScreens();
}

export default function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Platform.OS === 'web' ? '#f5f5f5' : '#fff' }}>
      <StatusBar style="light" />
      <AppNavigator />
      <Toast />
    </View>
  );
}

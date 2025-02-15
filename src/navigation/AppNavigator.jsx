import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateStreamScreen from '../screens/CreateStreamScreen';
import StreamDetailsScreen from '../screens/StreamDetailsScreen';
import useAuthStore from '../store/authStore';

// Use different navigators for web and native
const Stack = Platform.select({
  web: createStackNavigator(),
  default: createNativeStackNavigator(),
});

const AppNavigator = () => {
  const { user } = useAuthStore();

  const screenOptions = {
    headerStyle: {
      backgroundColor: '#AD52F7',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    ...(Platform.OS === 'web' && {
      cardStyle: { backgroundColor: '#fff' },
      headerMode: 'float',
    }),
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {!user ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateStream"
              component={CreateStreamScreen}
              options={{ title: 'Create Stream' }}
            />
            <Stack.Screen
              name="StreamDetails"
              component={StreamDetailsScreen}
              options={{ title: 'Stream' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

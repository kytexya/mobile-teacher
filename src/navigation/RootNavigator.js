import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';
import TeacherTabs from './TeacherTabs';
import LoginScreen from '../screens/LoginScreen';

export default function RootNavigator() {
  const { booting, user } = useAuth();

  if (booting) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // No need for a navigation header before login; once logged in, we show tabs.
  return (
    <NavigationContainer>
      {user ? <TeacherTabs /> : <LoginScreen />}
    </NavigationContainer>
  );
}


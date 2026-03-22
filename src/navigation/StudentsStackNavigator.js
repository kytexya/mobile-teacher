import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StudentsScreen from '../screens/StudentsScreen';
import StudentDetailScreen from '../screens/StudentDetailScreen';

const Stack = createNativeStackNavigator();

export default function StudentsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StudentsList"
        component={StudentsScreen}
        options={{ title: 'Hồ sơ học sinh' }}
      />
      <Stack.Screen
        name="StudentDetail"
        component={StudentDetailScreen}
        options={{ title: 'Chi tiết học sinh' }}
      />
    </Stack.Navigator>
  );
}


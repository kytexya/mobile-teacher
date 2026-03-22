import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import AttendanceScreen from '../screens/AttendanceScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import MenuTimetableScreen from '../screens/MenuTimetableScreen';
import StudentsStackNavigator from './StudentsStackNavigator';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TeacherTabs() {
  const { user } = useAuth();
  const title = user?.name ? `Xin chào, ${user.name.split(' ')[0]}` : 'Giáo viên';

  return (
    <Tab.Navigator
      initialRouteName="Attendance"
      screenOptions={{
        headerShown: true,
        headerTitle: title,
        tabBarActiveTintColor: '#0B84F3',
      }}
    >
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{
          tabBarLabel: 'Điểm danh',
          tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-circle" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Activities"
        component={ActivitiesScreen}
        options={{
          tabBarLabel: 'Hoạt động',
          tabBarIcon: ({ color, size }) => <Ionicons name="create" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="MenuTimetable"
        component={MenuTimetableScreen}
        options={{
          tabBarLabel: 'Thời khóa & ăn',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Students"
        component={StudentsStackNavigator}
        options={{
          tabBarLabel: 'Hồ sơ bé',
          tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Tài khoản',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}


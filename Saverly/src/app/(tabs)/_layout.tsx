import React from 'react';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { BottomFabBar } from 'rn-wave-bottom-bar';
import HomeScreen from './Home';
import AccountsScreen from './Accounts';
import ChatScreen from './Chat';
import SettingsScreen from './Settings';
import MonthlyPaymentsScreen from '../(hidden)/Month';
import {AccountsStackNavigator, HomeStackNavigator, MonthStackNavigator } from '../../components/StackNavigators';





import 'react-native-reanimated'
import 'react-native-gesture-handler'
type TabIconProps = {
  name: 'Overview' | 'Accounts' | 'Settings' | 'Chat';
  focused: boolean;
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabIcon: React.FC<TabIconProps> = ({ name, focused }) => {
  const iconName: any = (() => {
    switch (name) {
      case 'Overview':
        return focused ? 'home' : 'home-outline';
      case 'Accounts':
        return focused ? 'card' : 'card-outline';
      case 'Settings':
        return focused ? 'calendar-outline' : 'calendar-outline';
      case 'Chat':
        return focused ? 'chatbubble-ellipses' : 'chatbubble-outline';
      default:
        return 'alert-circle';
    }
  })();

  return <Ionicons name={iconName} size={24} color={focused ? '#6AD4DD' : '#FFFFFF'} />;
};

const TabLayout: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1e1f22',
        tabBarActiveBackgroundColor: '#1e1f22',
        tabBarInactiveTintColor: '#6AD4DD',
        tabBarStyle: {
          backgroundColor: '#6AD4DD',
        },
      }}
      tabBar={(props: any) => (
        <BottomFabBar
          mode={'default'}
          isRtl={false}
          focusedButtonStyle={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.41,
            shadowRadius: 9.11,
            elevation: 14,
          }}
          bottomBarContainerStyle={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
          {...props}
        />
      )}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name="Overview" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Accounts"
        component={AccountsStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name="Accounts" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name="Chat" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={MonthStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name="Settings" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabLayout;

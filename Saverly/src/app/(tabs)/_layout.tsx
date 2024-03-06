import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
  
const TabIcon = ({ name, focused }) => {
    const iconName = (() => {
      switch (name) {
        case 'Overview':
          return focused ? 'home' : 'home-outline';
        case 'Accounts':
          return focused ? 'card' : 'card-outline';
        case 'Settings':
          return focused ? 'settings' : 'settings-outline';
        case 'Chat':
          return focused ? 'chatbubble-ellipses' : 'chatbubble-outline';
        default:
          return 'alert-circle'; // default icon if route name doesn't match
      }
    })();
  
    return <Ionicons name={iconName} size={24} color={focused ? '#6C63FF' : '#BEBEC5'} />;
  };
  
  const TabLayout = () => {
    return (
      <Tabs>
        <Tabs.Screen
          name="Home"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon name="Overview" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="Accounts"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon name="Accounts" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="Chat"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon name="Chat" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="Settings"
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="Settings" focused={focused} />,
          }}
        />
      </Tabs>
    );
  };

export default TabLayout
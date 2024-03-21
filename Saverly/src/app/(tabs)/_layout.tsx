import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BottomFabBar } from 'rn-wave-bottom-bar'; // Import your custom tab bar
import HomeScreen from './Home'; // Import your screen components
import AccountsScreen from './Accounts';
import ChatScreen from './Chat';
import SettingsScreen from './Settings';


type TabIconProps = {
  name: 'Overview' | 'Accounts' | 'Settings' | 'Chat';
  focused: boolean;
};

const Tab = createBottomTabNavigator();

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
        return 'alert-circle'; // default icon if route name doesn't match
    }
  })();

  return <Ionicons name={iconName} size={24} color={focused ? '#00A9FF' : '#DDDDDD'} />;
};

const TabLayout: React.FC = () => {
  return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#FFFFFF',
          tabBarActiveBackgroundColor: '#00A9FF',
          tabBarInactiveTintColor: '#FFFFFF',
          tabBarStyle: {
            backgroundColor: '#FFFFFF', // For active tab background
            
          },
        }}
        tabBar={(props: any) => (
          <BottomFabBar
            mode={ 'default'} // Assuming you want the 'square' mode, not 'default'
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
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon name="Overview" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Accounts"
          component={AccountsScreen}
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
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="Settings" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    
  );
};

export default TabLayout;
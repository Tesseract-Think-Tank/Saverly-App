import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './app/screens/Login';
import SignUp from './app/screens/SignUp';
import Details from './app/screens/Details';
import Home from './app/screens/Home';
import AddAccount from './app/screens/AddAccount';
import Chat from './app/screens/Chat'; 


// Import any other icons you want to use
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Create a bottom tab navigator component
function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Overview') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Accounts') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          // Return the icon component
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6C63FF', // Active tab label color
        tabBarInactiveTintColor: '#BEBEC5', // Inactive tab label color
        tabBarLabelStyle: styles.tabLabel, // Style for the tab label text
        tabBarStyle: styles.tabNavigator, // Style for the bottom tab navigator  
      })}
    >
      <Tab.Screen name="Overview" component={Home} />
      <Tab.Screen name="Accounts" component={AddAccount} />
      <Tab.Screen name="Settings" component={Details} />
    </Tab.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        {/* MainAppTabs will be the initial route after login/signup */}
        <Stack.Screen
          name="MainAppTabs"
          component={MainAppTabs}
          options={{ headerShown: false }} // You can set this to true if you want a header
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{ headerShown: true }} // Or false if you don't want a header
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // Style for the container of the App component, if needed
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Style for the bottom tab navigator
  tabNavigator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 20,
    backgroundColor: '#ffffff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#7F5DF0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    height: 50,
  },
  // Style for each tab item
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  // Style for the tab icon
  tabIcon: {
    marginBottom: 3,
  },
  // Style for the tab label text
  tabLabel: {
    fontSize: 12,
  },
  // Style for the active tab label
  activeTabLabel: {
    color: '#6C63FF',
  },
  // Style for the inactive tab label
  inactiveTabLabel: {
    color: '#BEBEC5',
  },
});

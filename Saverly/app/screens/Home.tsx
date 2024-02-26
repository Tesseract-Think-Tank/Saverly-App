import { View, Text,Button, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { fetchDataForUser } from '../services/firebaseServices'; // Adjust the import path according to your project structure
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebaseConfig'; // Adjust the import path according to your project structure
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
// ... other imports ...
import { Platform} from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});
export async function SendNotification() {
    console.log("Sending push Notification..");
    const expoPushToken = await getExpoPushToken();
    const message = {
        to: expoPushToken,
        sound: "default",
        title: "test mesaj",
        body: "test sa vad daca merge",
    }
    await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
        host: "exp.host",
        accept: "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
        },
        body: JSON.stringify(message),
    });
}
  // Function to get Expo push token
    async function getExpoPushToken() {
    let token;
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        });
    }
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        }
        if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
        }
        token = (await Notifications.getExpoPushTokenAsync({ projectId: 'd26dbd6f-05d3-4fcc-a070-e25fedd3476a' })).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }
    return token;
}
async function schedulePushNotification() {
  // Specify the date and time for the notification
  const notificationDate = new Date(2024, 1, 26, 15, 0, 0); // Year, Month (0-indexed), Day, Hour, Minute, Second

  await Notifications.scheduleNotificationAsync({
      content: {
          title: "Scheduled Notification",
          body: 'This notification is scheduled for February 27, 2024',
      },
      trigger: { date: notificationDate },
  });
}

const { width } = Dimensions.get('window');

const screenWidth = Dimensions.get('window').width;

const Home = ({ navigation }: any) => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [userId, setUserId] = useState(null);
  const fetchData = async () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) {
      // Handle the case where there is no user logged in
      return;
    }
    
    const userData = await fetchDataForUser(userId);
    setIncome(userData.income);
    setExpenses(userData.expenses);
  };

  // Use useFocusEffect to fetch data when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      // Optionally return a cleanup function if needed
      return () => {};
    }, [])
  );

  const balance = income - expenses;
  
  return (
    
    <SafeAreaView style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Balance: ${balance.toFixed(2)}</Text>
      </View>
      <View style={styles.boxContainer}>
        
        <LinearGradient
        colors={['#34c3c7', '#c8edeb']} // Gradient for income box
        style={styles.boxGradient}
        >
          <Ionicons name="arrow-up" size={24} color="white" />
          <Text style={styles.boxTitle}>Income</Text>
          <Text style={styles.boxValue}>${income.toFixed(2)}</Text>
          </LinearGradient>
        
        <LinearGradient
            colors={['#8E8E93', '#c1c1c3']} // Gradient for expenses box
            style={styles.boxGradient}
          >
          <Ionicons name="arrow-down" size={24} color="white" />
          <Text style={styles.boxTitle}>Expenses</Text>
          <Text style={styles.boxValue}>${expenses.toFixed(2)}</Text>
        </LinearGradient>
        
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Details')}
        activeOpacity={0.7} // Optional: reduce the opacity on touch
      >
        <Ionicons name='add' size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.chatButton} // Positioned above the existing add button
        onPress={() => navigation.navigate('Chat')}
        activeOpacity={0.7}
      >
        <Ionicons name='chatbubbles' size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addButton}
        onPress={schedulePushNotification}
        activeOpacity={0.7}>
        <Text style={styles.addButton}>Send Notification</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 33,
    padding: 16,
    backgroundColor: '#fff',
  },
  balanceContainer: {
    marginBottom: 24,
  },
  balanceText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boxIncome: {
    backgroundColor: '#34C759', // A green color
    borderRadius: 20,
    padding: 16,
    width: '48%',
    alignItems: 'center',
  },
  boxExpenses: {
    backgroundColor: '#8E8E93', // A gray color
    borderRadius: 20,
    padding: 16,
    width: '48%',
    alignItems: 'center',
  },
  boxGradient: {
    borderRadius: 20,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
  },
  boxTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  boxValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  addButton: {
    position: 'absolute', // Position over your other content
    right: (width - 56) / 2, // 30 units from the right
    bottom: 60, // 30 units from the bottom
    backgroundColor: '#7e57c2', // Replace with the color of your choice
    width: 56, // Diameter of the FAB
    height: 56, // Diameter of the FAB
    borderRadius: 28, // Half the size of width & height to make it perfectly round
    justifyContent: 'center', // Center the '+' icon vertically
    alignItems: 'center', // Center the '+' icon horizontally
    shadowColor: '#9e9e9e', // Shadow Color
    shadowOpacity: 0.5, // Shadow Opacity
    shadowRadius: 5, // Shadow Radius
    shadowOffset: { height: 5, width: 5 }, // Shadow Offset
    elevation: 6, // This adds a shadow on Android
  },
  chatButton: {
    position: 'absolute',
    left: width - 60,
    bottom: 60,
    backgroundColor: '#7e57c2',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9e9e9e',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { height: 5, width: 5 },
    elevation: 6,
  },
});

export default Home;

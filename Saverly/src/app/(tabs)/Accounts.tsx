<<<<<<< Updated upstream
// AccountsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { fetchUserAccounts } from '../../services/accountService'; // Adjust the import path as necessary
=======
import React, { useState, useCallback,useRef } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
>>>>>>> Stashed changes
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
<<<<<<< Updated upstream
=======
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import {FIREBASE_AUTH,FIREBASE_DB } from '../../../firebaseConfig';
import {Animated} from 'react-native';
>>>>>>> Stashed changes


const { width } = Dimensions.get('window');

const AccountCard = ({ type, balance, currency }: { type: string, balance: number, currency: string }) => (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>{type}</Text>
        <Text>{`Balance: ${balance} ${currency}`}</Text>
    </View>
);

const AccountsScreen = ({ navigation }: any) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
<<<<<<< Updated upstream

  useFocusEffect( 
    React.useCallback(() => {
    const loadAccounts = async () => {
        setLoading(true);
        try {
            const fetchedAccounts = await fetchUserAccounts();
            setAccounts(fetchedAccounts as never[]);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch accounts.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
=======
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [areButtonsVisible, setAreButtonsVisible] = useState(false);

  const userId = FIREBASE_AUTH.currentUser?.uid;

  const opacityAnim = useRef(new Animated.Value(0)).current; // For fade-in effect
  const positionAnim = useRef(new Animated.Value(1)).current;

  const toggleButtonsVisibility = () => {
    setAreButtonsVisible((prevVisible) => !prevVisible);
    // Trigger animation based on the new state
    Animated.timing(opacityAnim, {
      toValue: areButtonsVisible ? 0 : 1, // Fade in if becoming visible, out if hiding
      duration: 300,
      useNativeDriver: true,
    }).start();
  
    Animated.timing(positionAnim, {
      toValue: areButtonsVisible ? 1 : 0, // Slide up if becoming visible, down if hiding
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fetchExpensesForAccount = async (accountId) => {
    try {
      const expensesCollectionRef = collection(FIREBASE_DB, 'users', userId, 'expenses');
      // Use the 'where' function to query for only the expenses that match the accountId
      const expensesQuery = query(expensesCollectionRef, where("accountId", "==", accountId));
      const expensesSnapshot = await getDocs(expensesQuery);
  
      console.log(`Expenses for account ${accountId}:`);
  
      if (expensesSnapshot.empty) {
        console.log('No matching documents in expenses collection for account:', accountId);
        return [];
      }
  
      const expensesForAccount = expensesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      return expensesForAccount; // Returns only expenses for the given accountId
    } catch (error) {
      console.error("Error fetching expenses for account:", accountId, error);
      throw error; // It's usually better to throw the error so that you can handle it where the function is called
    }
  };
  
>>>>>>> Stashed changes

    loadAccounts();
    return () => {
      // Cleanup actions if required
    };
  }, [])
  );

return (
    <View style={styles.container}>
<<<<<<< Updated upstream
        <ScrollView style={styles.container}>
            {loading ? <Text>Loading accounts...</Text> : accounts.map((account: { id: string, type: string, balance: number, currency: string }) => (
                <AccountCard key={account.id} type={account.type} balance={account.balance} currency={account.currency} />
            ))}
    
        </ScrollView>
        <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('AddAccount')}
        activeOpacity={0.7} // Optional: reduce the opacity on touch
      >
        <Ionicons name='add' size={24} color="white" />
      </TouchableOpacity>
=======
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContentContainer}
        data={accounts}
        renderItem={({ item }) => <AccountCard account={item} />}
        keyExtractor={(item) => item.id.toString()}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
  
      {/* Toggle Button */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={toggleButtonsVisibility}
        activeOpacity={0.7}
      >
        <Ionicons name="ellipsis-vertical" size={30} color="#FFF" />
      </TouchableOpacity>
  
      {/* Animated Buttons */}
      {areButtonsVisible && (
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: opacityAnim,
              transform: [{ translateY: positionAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -20] // Change based on your UI needs
              }) }],
            },
          ]}
        >
          {/* Add Account Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('AddAccount')}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
  
          {/* Add Expense Button */}
          <TouchableOpacity
            style={styles.fab}
            onPress={() => router.push('addExpense')}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={30} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>
      )}
    
      <Pagination index={activeIndex} total={accounts.length} />
>>>>>>> Stashed changes
    </View>
    
    
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< Updated upstream
    padding: 10,
=======
    backgroundColor: '#33404F',
  },
  flatListContentContainer: {
    paddingTop: 0, // space from the top of the screen
  },
  fab: {
    position: 'absolute',
    right: (width-56) / 2, // Adjust this value based on your screen width and FAB width (56
    bottom: 110, // Adjust this value based on your tab bar height
    backgroundColor: '#B5C5C3', // Use your app's theme color
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#89CFF3',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 5, height: 5 },
  },
  cardContainer: {
    width: width, // each card spans the full width
    height: CARD_HEIGHT, // set height of the card
    paddingTop: 60, // add padding to the top of the card
    alignItems: 'center',
  },
  animatedContainer: {
    // Container for the animated buttons
    position: 'absolute',
    right: 20, // Adjust based on your layout
    bottom: 80, // Adjust based on your layout
  },
  actionButton: {
    position: 'relative', // Position the button over the content
    right: 30, // 30 pixels from the right edge of the screen
    bottom: 30, // 30 pixels from the bottom edge of the screen
    backgroundColor: '#00DDA3', // A bright color to stand out
    width: 56, // The diameter of the FAB
    height: 56, // The diameter of the FAB
    borderRadius: 28, // Half the size of the width/height to create a circle
    justifyContent: 'center', // Center the icon horizontally
    alignItems: 'center', // Center the icon vertically
    elevation: 6, // Shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 4 }, // Shadow position for iOS
    shadowOpacity: 0.3, // Shadow opacity for iOS
    shadowRadius: 4, // Shadow blur radius for iOS
    zIndex: 10, // Ensure the button stays above other elements
  },
  expenseCard: {
    backgroundColor: '#FFFFFF', // Light background for the card
    borderRadius: 8, // Rounded corners
    padding: 16, // Padding inside the card
    marginBottom: 8, // Space between each card
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2, // Shadow direction (downwards)
    },
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 3.84, // Shadow blur radius
    elevation: 5, // Elevation for Android
    marginHorizontal: 16, // Horizontal margin
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#33404F',
  },
  cardCategory: {
    fontSize: 16,
    color: '#33404F',
    marginTop: 4,
  },
  cardDate: {
    fontSize: 14,
    color: '#33404F',
    marginTop: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#33404F',
    marginTop: 4,
>>>>>>> Stashed changes
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AccountsScreen;

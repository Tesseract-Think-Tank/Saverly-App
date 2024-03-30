import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { fetchUserAccounts } from '../../services/accountService'; // Adjust as necessary
import { router } from 'expo-router';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import PageHeader from '@/components/PageHeader';

const { width, height } = Dimensions.get('window');

const CARD_HEIGHT = height * 0.6; // 60% of the screen height

const AccountCard = ({ account, onSelectAccount, navigation }) => (
  <View style={styles.cardContainer}>
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{account.type}</Text>
      <Text style={styles.cardBalance}>{`Balance: ${account.balance.toFixed(2)} ${account.currency}`}</Text>
    </View>
  </View>
);

const Pagination = ({ index, total }) => {
  let dots = [];
  for (let i = 0; i < total; i++) {
    dots.push(
      <View
        key={i}
        style={[
          styles.dot,
          index === i ? styles.activeDot : styles.inactiveDot,
        ]}
      />
    );
  }
  return <View style={styles.paginationContainer}>{dots}</View>;
};

const AccountsScreen = ({ navigation }) => {
  const [accounts, setAccounts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [areButtonsVisible, setAreButtonsVisible] = useState(false);
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);

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

  const toggleOptionsVisibility = () => {
    setAreOptionsVisible((prevVisible) => !prevVisible);
    // Trigger animation based on the new state
    Animated.timing(opacityAnim, {
      toValue: areOptionsVisible ? 0 : 1, // Fade in if becoming visible, out if hiding
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(positionAnim, {
      toValue: areOptionsVisible ? 1 : 0, // Slide up if becoming visible, down if hiding
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fetchExpensesForAccount = async (accountId) => {
    try {
      const expensesCollectionRef = collection(FIREBASE_DB, 'users', userId, 'expenses');
      const expensesQuery = query(expensesCollectionRef, where("accountId", "==", accountId));
      const expensesSnapshot = await getDocs(expensesQuery);

      if (expensesSnapshot.empty) {
        console.log('No matching documents in expenses collection for account:', accountId);
        return [];
      }

      const expensesForAccount = expensesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return expensesForAccount;
    } catch (error) {
      console.error("Error fetching expenses for account:", accountId, error);
      throw error;
    }
  };

  const loadAccounts = async () => {
    setLoading(true);
    try {
      let fetchedAccounts = await fetchUserAccounts();
      fetchedAccounts = await Promise.all(fetchedAccounts.map(async (account) => {
        const expenses = await fetchExpensesForAccount(account.id);
        return { ...account, expenses };
      }));

      setAccounts(fetchedAccounts);

      if (fetchedAccounts.length > 0) {
        setSelectedAccount(fetchedAccounts[0]);
        setActiveIndex(0);
      }
    } catch (error) {
      console.error('Error loading accounts or expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAccounts();
    }, [])
  );

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const activeIndex = Math.round(contentOffsetX / width);
    setActiveIndex(activeIndex);
    const selectedAccount = accounts[activeIndex];
    setSelectedAccount(selectedAccount);
    console.log('Active Index:', activeIndex);
  };

  return (
    <><PageHeader title='Accounts'></PageHeader><View style={styles.container}>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContentContainer}
        data={accounts}
        renderItem={({ item }) => <AccountCard account={item} navigation={navigation}
          onSelectAccount={(selectedAccount) => {
            setSelectedAccount(selectedAccount);
          } } />}
        keyExtractor={(item) => item.id.toString()}
        onScroll={handleScroll}
        scrollEventThrottle={16} />
      {selectedAccount && (
        <View style={styles.expensesListContainer}>
          <FlatList
            data={selectedAccount.expenses}
            renderItem={({ item }) => {
              const date = item.dateAndTime?.toDate().toLocaleDateString('en-US');
              return (
                <View style={styles.expenseCard}>
                  <Text style={styles.cardAmount}>{item.currency} {item.amount}</Text>
                  <Text style={styles.cardCategory}>{item.category}</Text>
                  <Text style={styles.cardDate}>{date}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                </View>
              );
            } }
            keyExtractor={(item) => item.id.toString()} />
        </View>
      )}

      <TouchableOpacity
        style={styles.actionButton}
        onPress={toggleButtonsVisibility}
        activeOpacity={0.7}
      >
        <Ionicons name="ellipsis-vertical" size={30} color="#fff" />
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: opacityAnim,
            transform: [{
              translateY: positionAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -20]
              })
            }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.optionButton2}
          onPress={() => navigation.navigate('AddExpenseForAcc', { selectedAccount: selectedAccount })}
          activeOpacity={0.7}
        >
          <Ionicons name="receipt-outline" size={30} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton3}
          onPress={() => navigation.navigate('addFundsScreen', { selectedAccount: selectedAccount })}
          activeOpacity={0.7}
        >
          <Ionicons name="cash-outline" size={30} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => router.push('AddAccount')}
          activeOpacity={0.7}
        >
          <Ionicons name="card" size={30} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>
      <Pagination index={activeIndex} total={accounts.length} />
    </View></>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#33404F',
  },
  flatListContentContainer: {
    paddingTop: 0, // space from the top of the screen
  },
  fab: {
    position: 'relative',
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
  addButtonText: {
    color: 'white', // White color for the text
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContainer: {
    width: width, // each card spans the full width
    height: CARD_HEIGHT, // set height of the card
    paddingTop: 60, // add padding to the top of the card
    alignItems: 'center',
  },
  animatedContainer: {
    // Container for the animated buttons
    position: 'relative',
    right: 120, // Adjust based on your layout
    bottom: 80, // Adjust based on your layout
  },
  actionButton: {
    position: 'relative', // Position the button over the content
    right: 0, // 30 pixels from the right edge of the screen
    left: width-70,
    bottom: 110, // 30 pixels from the bottom edge of the screen
    backgroundColor: '#6AD4DD', // A bright color to stand out
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
    backgroundColor: '#fff', // Light background for the card
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
  },
  optionButton: {
    position: 'absolute',
    left:width+50,
    bottom: 100,
    backgroundColor: '#B5C5C3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6AD4DD',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  optionButton2: {
    position: 'absolute',
    left:width+50,
    bottom: 160, // adjust the vertical position
    backgroundColor: '#B5C5C3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6AD4DD',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },

  },
  optionButton3: {
    position: 'absolute',
    left:width+50,
    bottom: 220, // adjust the vertical position
    backgroundColor: '#B5C5C3',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignSelf:'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6AD4DD',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  card: {
    bottom:40,
    backgroundColor: 'white',
    borderRadius: 20,
    width: width * 0.9, // card takes 90% of screen width
    height: 200, // card height is 80% of CARD_HEIGHT
    justifyContent: 'center', // center the card's content vertically
    alignItems: 'center', // center the card's content horizontally
    marginHorizontal: width * 0.05, // add horizontal margin
    padding: 20,
    // Shadow properties can be adjusted as needed
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cardBalance: {
    fontSize: 20,
    color: '#555',
    marginTop: 10,
  },
  addButton: {
    position: 'relative',
    right: (width - 56) / 2, // center the button horizontally
    bottom: 110,
    backgroundColor: '#B5C5C3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 530,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#6AD4DD',
  },
  inactiveDot: {
    backgroundColor: '#B5C5C3',
  },
  expensesListContainer: {
    top:300,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default AccountsScreen;

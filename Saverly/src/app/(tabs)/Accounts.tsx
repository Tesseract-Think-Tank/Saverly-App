import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { fetchUserAccounts } from '../../services/accountService'; // Adjust as necessary
import { router } from 'expo-router';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import {FIREBASE_AUTH,FIREBASE_DB } from '../../../firebaseConfig';

const { width, height } = Dimensions.get('window');

const CARD_HEIGHT = height * 0.6; // 60% of the screen height

const AccountCard = ({ account }) => (
  <View style={styles.cardContainer}>
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{account.type}</Text>
      <Text style={styles.cardBalance}>{`Balance: ${account.balance.toFixed(2)} ${account.currency}`}</Text>
      {/* Expenses List */}
      <FlatList
        data={account.expenses}
        renderItem={({ item }) => {
          // You might need to adjust the item.dateAndTime handling based on your data structure
          const date = item.dateAndTime?.toDate().toLocaleDateString('en-US');
          return (
            <View style={styles.expenseCard}>
              <Text style={styles.cardAmount}>${item.amount}</Text>
              <Text style={styles.cardCategory}>{item.category}</Text>
              <Text style={styles.cardDate}>{date}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
      />
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
          index === i
            ? styles.activeDot
            : styles.inactiveDot,
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

  const userId = FIREBASE_AUTH.currentUser?.uid;
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
  

  const loadAccounts = async () => {
    setLoading(true);
    try {
      let fetchedAccounts = await fetchUserAccounts();
      fetchedAccounts = await Promise.all(fetchedAccounts.map(async (account) => {
        const expenses = await fetchExpensesForAccount(account.id);
        return { ...account, expenses };
      }));
      setAccounts(fetchedAccounts);
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
    console.log('Active Index:', activeIndex); 
  };

  const renderItem = ({ item }) => {
    const date = item.dateAndTime?.toDate().toLocaleDateString('en-US');
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardAmount}>${item.amount}</Text>
            <Text style={styles.cardCategory}>{item.category}</Text>
            <Text style={styles.cardDate}>{date}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
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
      
      {/* Add Account Floating Action Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('AddAccount')}
        activeOpacity={0.7}
      >
        <Ionicons name='add' size={30} color="white" />
      </TouchableOpacity>
      <Pagination index={activeIndex} total={accounts.length} />

    </View>
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
  cardContainer: {
    width: width, // each card spans the full width
    height: CARD_HEIGHT, // set height of the card
    paddingTop: 60, // add padding to the top of the card
    alignItems: 'center',
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
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: width * 0.9, // card takes 90% of screen width
    height: CARD_HEIGHT, // card height is 80% of CARD_HEIGHT
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
    position: 'absolute',
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
    bottom: 560,
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
    backgroundColor: '#00DDA3',
  },
  inactiveDot: {
    backgroundColor: '#B5C5C3',
  },
});

export default AccountsScreen;
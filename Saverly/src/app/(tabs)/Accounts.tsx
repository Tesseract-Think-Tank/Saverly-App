import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { fetchUserAccounts } from '../../services/accountService'; // Adjust as necessary
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const CARD_HEIGHT = height * 0.6; // 60% of the screen height

const AccountCard = ({ account }) => (
  <View style={styles.cardContainer}>
    <View style={styles.card}>
      {/* You can add more details and style according to your card info */}
      <Text style={styles.cardTitle}>{account.type}</Text>
      <Text style={styles.cardBalance}>{`Balance: ${account.balance} ${account.currency}`}</Text>
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
    // New state to manage the active card index
  const [activeIndex, setActiveIndex] = useState(0);


  const loadAccounts = async () => {
    setRefreshing(true);
    try {
      const fetchedAccounts = await fetchUserAccounts();
      setAccounts(fetchedAccounts);
    } catch (error) {
      console.error(error);
    }
    setRefreshing(false);
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
        scrollEventThrottle={16} // Add this for better performance
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
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: width * 0.9, // card takes 90% of screen width
    height: CARD_HEIGHT * 0.4, // card height is 80% of CARD_HEIGHT
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
    bottom: 80,
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
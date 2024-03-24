import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, FlatList, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth} from 'firebase/auth';
import { fetchDataForUser } from '../../services/firebaseServices'; // Adjust the import path according to your project structure
import { doc, getDoc, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { router } from 'expo-router';


const { width, height } = Dimensions.get('window');

const cardHeight = height / 6.9; // Height of a single card
const listHeight = cardHeight * 3; // Height of the list to display only 3 cards

const Home = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [listData, setListData] = useState([]);
  const [userId, setUserId] = useState(null);

  const fetchUserData = async () => {
    const auth = getAuth();
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) {
      console.log('No user logged in');
      return;
    }

    setUserId(currentUserId);

    const userData = await fetchDataForUser(currentUserId);
    setIncome(userData.income);
    setExpenses(userData.expenses);

    await fetchExpenses(currentUserId);
  };

  const deleteExpenseById = async (expenseId) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              if (!userId) {
                console.log('User ID not set');
                return;
              }
  
              // Fetch the expense data using the expenseId
              const expenseDocRef = doc(FIREBASE_DB, 'users', userId, 'expenses', expenseId);
              const expenseDocSnapshot = await getDoc(expenseDocRef);
  
              if (!expenseDocSnapshot.exists()) {
                console.log('Expense not found');
                return;
              }
  
              // Extract the expense amount from the expense data
              const expenseAmount = expenseDocSnapshot.data().amount;
  
              // Add the expense amount back to the income
              setIncome((prevIncome) => prevIncome + expenseAmount);
              // Fetch the user's expenses data
              const userData = await fetchDataForUser(userId);
              
              // Subtract the expense amount from the total expenses
              const newExpenses = userData.expenses - expenseAmount;
              setExpenses(newExpenses);
              // Update the user's expenses data in Firebase
              const userDocRef = doc(FIREBASE_DB, 'users', userId);
              await updateDoc(userDocRef, {
                expenses: newExpenses,
              });
              await updateDoc(userDocRef,{
                income: userData.income+expenseAmount
              })
  
              // Delete the expense from Firebase
              await deleteDoc(expenseDocRef);
              console.log('Expense deleted successfully');
  
              // Update the listData
              setListData((prevListData) => prevListData.filter((item) => item.id !== expenseId));
            } catch (error) {
              console.error('Error deleting expense', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const fetchExpenses = async (userId) => {
    try {
      const expensesCollectionRef = collection(FIREBASE_DB, 'users', userId, 'expenses');
      const expensesSnapshot = await getDocs(expensesCollectionRef);
      if (expensesSnapshot.empty) {
        return;
      }
      const newExpensesData = expensesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListData(newExpensesData);
    } catch (error) {
      console.error("Error fetching expenses: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const balance = income - expenses;

  const renderItem = ({ item }) => {
    const date = item.dateAndTime?.toDate().toLocaleDateString('en-US');
    const handleDelete = () => deleteExpenseById(item.id);

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardAmount}>${item.amount}</Text>
            <Text style={styles.cardCategory}>{item.category}</Text>
            <Text style={styles.cardDate}>{date}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-bin-outline" size={22} color="#00DDA3" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Balance: {balance.toFixed(2)} RON</Text>
      </View>

      <View style={styles.boxContainer}>
        <LinearGradient colors={['#00DDcf', '#00DDA3']} style={styles.boxGradient}>
          <Ionicons name="arrow-up" size={24} color="white" />
          <Text style={styles.boxTitle}>Income</Text>
          <Text style={styles.boxValue}>{income.toFixed(2)} RON</Text>
        </LinearGradient>

        <LinearGradient colors={['#B5C5C3', '#B5C5Df']} style={styles.boxGradient}>
          <Ionicons name="arrow-down" size={24} color="white" />
          <Text style={styles.boxTitle}>Expenses</Text>
          <Text style={styles.boxValue}>{expenses.toFixed(2)} RON</Text>
        </LinearGradient>
      </View>

      <View style={styles.divider} />

      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={[styles.list, { height: listHeight }]}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('addExpense')}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 33,
    paddingHorizontal: 16,
    backgroundColor: '#33404F',
  },
  balanceContainer: {
    marginBottom: height / 100,
    height: height / 20,
  },
  divider: {
    borderBottomColor: 'rgba(0, 0, 0, 0.1)', // Semi-transparent black for a subtle look
    borderBottomWidth: 1, // Thickness of the divider line
    marginTop: height/50, // Spacing above the line
    marginBottom: height/50 - 8, // Spacing below the line
    width: '90%', // Take up the full width of the screen
    alignSelf: 'center', // Center the line
    color:'#00DDA3'
  },
  balanceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#fffff0',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: height / 7, // Adjust the height of the card based on your screen size
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
  deleteButton: {
    marginLeft: 12,
    padding: 10,
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boxGradient: {
    borderRadius: 20,
    padding: 16,
    width: width * 0.45, // adjusted for better responsiveness
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    shadowColor: '#000', // adding shadow for depth
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  listItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  list: {
    marginTop: 0,
    marginBottom: height/3.8,
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
});

export default Home;

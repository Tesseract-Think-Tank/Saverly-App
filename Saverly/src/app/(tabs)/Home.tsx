import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, FlatList, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { fetchDataForUser } from '../../services/firebaseServices'; // Adjust the import path according to your project structure
import { doc, getDoc, onSnapshot, getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import { useNavigation } from 'expo-router';
import { router } from 'expo-router';


const { width } = Dimensions.get('window');


const Home = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [listData, setListData] = useState([]);
  let userId;

  const fetchUserData = async () => {
    const auth = getAuth();
    userId = auth.currentUser?.uid;
    if (!userId) {
      console.log('No user logged in');
      return;
    }
    const userData = await fetchDataForUser(userId);
    setIncome(userData.income);
    setExpenses(userData.expenses);
  };

  const deleteExpenseById = async (expenseId) => {
    try {
      const expenseRef = doc(FIREBASE_DB, 'users', userId, 'expenses', expenseId);
      await deleteDoc(expenseRef);
      console.log('Expense deleted successfully');
      setListData((prevListData) => prevListData.filter((item) => item.id !== expenseId));
    } catch (error) {
      console.error('Error deleting expense', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const expensesCollectionRef = collection(FIREBASE_DB, 'users', userId, 'expenses');
      const expensesSnapshot = await getDocs(expensesCollectionRef);
      if (expensesSnapshot.empty) {
        console.log('No matching documents in expenses collection.');
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
      fetchExpenses();
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
            <Ionicons name="trash-bin-outline" size={22} color="#ff6961" />
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
        <LinearGradient colors={['#34c3c7', '#c8edeb']} style={styles.boxGradient}>
          <Ionicons name="arrow-up" size={24} color="white" />
          <Text style={styles.boxTitle}>Income</Text>
          <Text style={styles.boxValue}>{income.toFixed(2)} RON</Text>
        </LinearGradient>
        
        <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.boxGradient}>
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
        style={styles.list}
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
    backgroundColor: '#f5f5f5',
  },
  balanceContainer: {
    marginBottom: 24,
  },
  divider: {
    borderBottomColor: 'rgba(0, 0, 0, 0.1)', // Semi-transparent black for a subtle look
    borderBottomWidth: 1, // Thickness of the divider line
    marginTop: 16, // Spacing above the line
    marginBottom: 10, // Spacing below the line
  },
  balanceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#333',
  },
  cardCategory: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  cardDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#999',
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
    marginBottom: 170,
  },
  fab: {
    position: 'absolute',
    right: (width-56) / 2, // Adjust this value based on your screen width and FAB width (56
    bottom: 20, // Adjust this value based on your tab bar height
    backgroundColor: '#6C63FF', // Use your app's theme color
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 5, height: 5 },
  },
});

export default Home;

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, FlatList, Animated, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth} from 'firebase/auth';
import { fetchDataForUser } from '../../services/firebaseServices'; // Adjust the import path according to your project structure
import { doc, getDoc, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { router } from 'expo-router';
import PageHeader from '../../components/PageHeader';
import { getExpenseDateAndTime } from '@/services/accountService';
import AnimatedLoader from "react-native-animated-loader";



const { width, height } = Dimensions.get('window');

const cardHeight = height / 6.9; // Height of a single card
const listHeight = cardHeight * 3; // Height of the list to display only 3 cards

const Home = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [listData, setListData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [logData,setLogData] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);


  const fetchUserData = async () => {
    if (isInitialLoad) {
      setIsLoading(true);
    }
    try {
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
      await fetchLogs(currentUserId);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
        setIsInitialLoad(false); // Mark initial load as complete
      }
    }
  };
  

  const toggleShowLogs = () => {
    setShowLogs((prevShowLogs) => !prevShowLogs);
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
              let expenseAmount = expenseDocSnapshot.data().amount;
              const expensecurrency = expenseDocSnapshot.data().currency;
              //aici facem exchange-ul
              const exchangeRates = {
                'EUR:RON': 5, 'RON:EUR': 0.2,
                'USD:RON': 4.57, 'RON:USD': 0.22,
                'GBP:RON': 5.82, 'RON:GBP': 0.17,
                'EUR:USD': 1.09, 'USD:EUR': 0.92,
                'GBP:EUR': 1.17, 'EUR:GBP': 0.86,
                'USD:GBP': 0.79, 'GBP:USD': 1.27
            };
              const keyForExchangeRate = `${expensecurrency}:${'RON'}`;
              const exchangeRate = exchangeRates[keyForExchangeRate] || 1; 
              expenseAmount = expenseAmount * exchangeRate;
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
      setListData([]);
      return;
    }

    // Fetch each expense's date and time individually (inefficient)
    const expensesDataPromises = expensesSnapshot.docs.map(async (doc) => {
      const dateAndTime = await getExpenseDateAndTime(doc.id);
      return {
        id: doc.id,
        ...doc.data(),
        dateAndTime: dateAndTime || null, // Fallback to null if dateAndTime couldn't be fetched
      };
    });

    const newExpensesData = await Promise.all(expensesDataPromises);

    // Filter and sort as before
    const sortedExpensesData = newExpensesData
      .filter((item) => item.dateAndTime !== null)
      .sort((a, b) => b.dateAndTime - a.dateAndTime);

    setListData(sortedExpensesData);
  } catch (error) {
    console.error("Error fetching expenses: ", error);
  }
};

  

  const fetchLogs = async(userId) => {
    try{
      const logsCollectionRef = collection(FIREBASE_DB,'users',userId,'logs');
      const logsSnapshot = await getDocs(logsCollectionRef);
      if(logsSnapshot.empty){
        return;
      }
      const newLogsData = logsSnapshot.docs.map((doc) =>({
        id:doc.id,
        ...doc.data(),
      }));
      setLogData(newLogsData);
    }catch(error){
      console.error("Error fetching logs: ",error);
    } 
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const balance = income - expenses;

  const category_ionicons = {
    'Food': "fast-food-outline",
    'Transport': "car-outline",
    'Utilities': "home-outline",
    'Entertainment': "game-controller-outline",
    'Shopping': "cart-outline",
    'Health': "heart-circle-outline",
    'Other': "question-circle-o",
  };

  const categories = {
    'Food': require("../../assets/food.png"),
    'Transport': require("../../assets/transport.png"),
    'Utilities': require("../../assets/utilities.png"),
    'Entertainment': require("../../assets/entertainment.png"),
    'Shopping': require("../../assets/shopping.png"),
    'Health': require("../../assets/health.png"),
    'Other': require("../../assets/others.png"),
  };

  const renderItem = ({ item }) => {
    const date = item.dateAndTime?.toDate().toLocaleDateString('en-US');
    const handleDelete = () => deleteExpenseById(item.id);
  
    return (
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Ionicons name={category_ionicons[item.category]} size={30} color="black" />
          <View style={styles.cardMiddle}>
            <Text style={styles.cardCategory}>{item.category}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.cardDate}>{date}</Text>
          </View>
          <Text style={styles.cardAmount}>{item.amount} {item.currency}</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-bin-outline" size={22} color="#00DDA3" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  

  return (
    <>
    <PageHeader title="Home" />
    <SafeAreaView style={styles.container}>
    
    <View style={styles.balanceContainer}>
      <Text>
        <Text style={styles.currencyText}>BALANCE: </Text>
        <Text style={styles.balanceText}>{balance.toFixed(2)} RON</Text>
      </Text>
    </View>

      <View style={styles.boxContainer}>
        <LinearGradient colors={['#6AD4DD', '#6AD4DD']} style={styles.boxGradient}>
          <Ionicons name="arrow-up" size={24} color="white" />
          <Text style={styles.boxTitle} onPress={toggleShowLogs}>Income</Text>
          <Text style={styles.boxValue}>{income.toFixed(2)} RON</Text>
        </LinearGradient>

        <LinearGradient colors={['#DF1525', '#DF1525']} style={styles.boxGradient}>
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
      {showLogs && (
        <FlatList
          data={logData}
            renderItem={({ item }) => (
            <View style={styles.logItem}>
              {/* Display message, amount, and currency */}
              <Text style={styles.logItemText}>
                {item.message} + {item.balance.toFixed(2)} {item.currency}
              </Text>
            </View>
        )}
        
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
        
      )}
      
      {/* <LinearGradient
        colors={['transparent', '#33404F']}
        // Add locations for the gradient colors to define where the transition begins
        locations={[0, 1]}
        style={styles.fadeOutContainer}
      />
       */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('addExpense')}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
      <AnimatedLoader
            visible={isLoading} // Keep visible true because we are conditionally rendering this whole component
            overlayColor="rgba(150,150,150,0.95)"
            source={require("../../assets/white_dots.json")}
            animationStyle={styles.lottie}
            speed={1}
          >
            <Text>Loading...</Text>
      </AnimatedLoader>
    </SafeAreaView></>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
    backgroundColor: '#2B2D31',
  },
  fadeOutContainer: {
    position: 'absolute',
    bottom: 50, // start from the bottom of the container
    width: width, // stretch across the container
    height: cardHeight, // height of the fade effect
  },
  balanceContainer: {
    marginBottom: 0,
    height: height / 20,
  },
  logItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0,
    shadowRadius: 2,
    elevation: 0,
  },
  logItemText: {
    fontSize: 16,
    color: '#333',
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
  currencyText: {
    fontWeight: 'normal',
    fontSize: 22,
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardMiddle: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 16, // Adjust as needed for spacing
  },
  cardCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#33404F',
  },
  cardDescription: {
    fontSize: 14,
    color: '#999',
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    position: 'absolute', // Position it absolutely to align it in the middle-right
    left: 200, // Adjust this value to move the amount left or right
    alignSelf: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
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
    shadowColor: '#fff', // adding shadow for depth
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 0,
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
    marginBottom: 240,
  },
  fab: {
    position: 'absolute',
    right: (width-56) / 2, // Adjust this value based on your screen width and FAB width (56
    bottom: 110, // Adjust this value based on your tab bar height
    backgroundColor: '#6AD4DD', // Use your app's theme color
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#333',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 5, height: 5 },
  },
  categoryIcon: {
    width: 50,
    height: 50,
  },
  lottie: {
    width: 150,
    height: 150,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
  
});

export default Home;

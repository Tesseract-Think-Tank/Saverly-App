import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { addExpense,getAccounts } from '../../services/addExpense'; 
import { router } from 'expo-router';
import PageHeader from '@/components/PageHeader';
import { AntDesign } from '@expo/vector-icons';

const AddExpenseScreen = () => {
  
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Food',
    'Transport',
    'Utilities',
    'Entertainment',
    'Shopping',
    'Health',
    'Other',
  ];

  const currencies = [
    'RON',
    'USD',
    'EUR',
    'GBP'
  ];

  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true);
      try {
        const fetchedAccounts = await getAccounts(); 
        setAccounts(fetchedAccounts);
        setSelectedAccount(fetchedAccounts[0]); 
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch accounts');
      }
      setLoading(false);
    };

    loadAccounts();
  }, []);

  const handleAddExpense = async () => {
    if (!selectedAccount || !category || !amount || !description || !currency) {
      Alert.alert('Error', 'Please fill all the fields and select an account.');
      return;
    }
  
    setLoading(true);
  
    try {
      const convertedAmount = parseFloat(amount);
      const [selectedCurrency, selectedType] = selectedAccount.split('_');
      const account = accounts.find(acc => acc.currency === selectedCurrency && acc.type === selectedType);
      if (!account) throw new Error('Selected account not found.');
  
      await addExpense(selectedCurrency,selectedType, category, convertedAmount, description, currency); 
      Alert.alert('Success', 'Expense added successfully.');
  
     
      const refreshedAccounts = await getAccounts();
      setAccounts(refreshedAccounts);
  
      
      setCategory('');
      setAmount('');
      setDescription('');
      setCurrency('');
      setSelectedAccount(null); 
    } catch (error) {
      Alert.alert('Error', error.message || 'Could not add expense.');
    } finally {
      setLoading(false);
    }
    router.push('Home');
  };

  return (
    <>
    <TouchableOpacity
    style={styles.backButton}
    onPress={() => router.push('Home')} // Go back to the previous screen
    >
    <AntDesign name="left" size={24} color="#6AD4DD" />
  </TouchableOpacity>
    <PageHeader title="Add an expense" />
    <View style={styles.container}>
      <Text style={styles.title}>Add New Expense</Text>
      <View style={styles.inputContainer}>

        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}>
          {categories.map((cat, index) => (
            <Picker.Item key={index} label={cat} value={cat} />
          ))}
        </Picker>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder='Amount'
          keyboardType='numeric'
          style={styles.input} />
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder='Description'
          style={styles.input} />
        <Picker
          selectedValue={currency}
          onValueChange={(itemValue) => setCurrency(itemValue)}
          style={styles.picker}>
          {currencies.map((cat, index) => (
            <Picker.Item key={index} label={cat} value={cat} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedAccount}
          onValueChange={(itemValue) => setSelectedAccount(itemValue)}
          style={styles.picker}>
          {accounts.map((account) => (
            <Picker.Item
              key={`${account.currency}_${account.type}`}
              label={`${account.type} - ${account.currency}`}
              value={`${account.currency}_${account.type}`} />
          ))}
        </Picker>
        <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#6AD4DD" />
        ) : (
          <TouchableOpacity
            onPress={handleAddExpense}
            style={styles.button}
            disabled={loading}>
            <Text style={styles.buttonText}>Add Expense</Text>
          </TouchableOpacity>
        )}
        </View>
      </View>
    </View></>
  );
};

// You can reuse the styles from your AddAccountScreen or modify them as needed
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2B2D31',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#6AD4DD'
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
},
  
  picker: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 100,
    marginTop: 5,
    width: '100%', 
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
},
button: {
    backgroundColor: '#6AD4DD',
    width: '80%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
},
  backButton: {
    position: 'absolute',
    top:20,
    left:20,
    padding: 10,
    borderRadius: 5,
    zIndex:1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddExpenseScreen;

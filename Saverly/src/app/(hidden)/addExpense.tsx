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
  };

  return (
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
          style={styles.input}
        />
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder='Description'
          style={styles.input}
        />
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
            value={`${account.currency}_${account.type}`} 
          />
        ))}
      </Picker>
        {loading ? (
          <ActivityIndicator size="large" color="#00DDA3" />
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
  );
};

// You can reuse the styles from your AddAccountScreen or modify them as needed
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#33404F',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: '#B5C5C3',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  picker: {
    backgroundColor: '#B5C5C3',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    width: '100%', 
  },
  button: {
    backgroundColor: '#00DDA3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    zIndex:3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddExpenseScreen;

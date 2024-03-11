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
// No router import from 'expo-router' as this might be outdated or incorrect. Use navigation from props instead.
import { addExpense,getAccounts } from '../../services/addExpense'; // Make sure to implement getAccounts method in your services.

const AddExpenseScreen = ({ navigation }) => {
  // Define state hooks for each input and selection
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Categories remain the same
  const categories = [
    'Food',
    'Transport',
    'Utilities',
    'Entertainment',
    'Shopping',
    'Health',
    'Other',
  ];

  // Fetch accounts on component mount
  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true);
      try {
        const fetchedAccounts = await getAccounts(); // You will need to implement this
        setAccounts(fetchedAccounts);
        setSelectedAccount(fetchedAccounts[0]); // Optionally set the first account as selected by default
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
      // Convert amount to a number
      const convertedAmount = parseFloat(amount);
  
      // Find the account using the selected compound key
      const [selectedCurrency, selectedType] = selectedAccount.split('_');
      const account = accounts.find(acc => acc.currency === selectedCurrency && acc.type === selectedType);
      if (!account) throw new Error('Selected account not found.');
  
      await addExpense(account.id, category, convertedAmount, description, currency); // Assuming addExpense takes account ID
      Alert.alert('Success', 'Expense added successfully.');
  
      // Reload accounts to reflect changes
      const refreshedAccounts = await getAccounts();
      setAccounts(refreshedAccounts);
  
      // Reset the form
      setCategory('');
      setAmount('');
      setDescription('');
      setCurrency('');
      setSelectedAccount(null); // Reset selected account
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
        <TextInput
          value={currency}
          onChangeText={setCurrency}
          placeholder='Currency Code (e.g., USD, EUR)'
          style={styles.input}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
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
    backgroundColor: '#ffffff',
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
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  picker: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    width: '100%', // Make sure the picker fills the container
  },
  button: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddExpenseScreen;

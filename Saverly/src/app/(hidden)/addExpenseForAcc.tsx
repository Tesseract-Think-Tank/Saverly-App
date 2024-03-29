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

import {addExpenseForAcc} from '../../services/addExpenseForAcc';
import { router } from 'expo-router';
import PageHeader from '@/components/PageHeader';
import { AntDesign } from '@expo/vector-icons';

const AddExpenseForAccScreen = ({route}) => {
  
  const {selectedAccount} = route.params || {};
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('');
  const [loading, setLoading] = useState(false);
  console.log(selectedAccount.id);
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

  const handleAddExpense = async () => {
    if (!category || !amount || !description || !currency) {
      Alert.alert('Error', 'Please fill all the fields and select an account.');
      return;
    }
  
    setLoading(true);
  
    try {
      const convertedAmount = parseFloat(amount);
      await addExpenseForAcc(selectedAccount.id, category, convertedAmount, description, currency); 
      Alert.alert('Success', 'Expense added successfully.');
      setCategory('');
      setAmount('');
      setDescription('');
      setCurrency('');
    } catch (error) {
      Alert.alert('Error', error.message || 'Could not add expense.');
    } finally {
      setLoading(false);
    }
    router.push('Accounts');
  };

  return (
    <>
    <TouchableOpacity
    style={styles.backButton}
    onPress={() => router.back()} // Go back to the previous screen
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
    </View></>
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
    backgroundColor: '#6AD4DD',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    zIndex:3,
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

export default AddExpenseForAccScreen;

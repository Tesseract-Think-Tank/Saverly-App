import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import { addExpense } from '../../services/addExpense';
import { Picker } from '@react-native-picker/picker'; // Ensure this path matches your project structure

const AddExpenseScreen = ({ navigation } : any)  => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currency,setCurrency] = useState('');
  const [loading, setLoading] = useState(false);
  //const [accounts,setAccounts] = useState([]);


  const categories = [
    'Food',
    'Transport',
    'Utilities',
    'Entertainment',
    'Shopping',
    'Health',
    'Other',
  ];

  const handleAddExpense = async () => {
    if (!category || !amount || !description || !currency) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    setLoading(true);

    try {
      const convertedAmount = parseFloat(amount);
      await addExpense(category, convertedAmount, description,currency);
      Alert.alert('Success', 'Expense added successfully.');
      setCategory('');
      setAmount('');
      setDescription('');
      setCurrency('');
      setAccounts([]);

      router.back(); // Navigate back to the previous screen
    } catch (error : any) {
      console.error('Error adding expense:', error);
      Alert.alert('Error', error.message);
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
          onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
          style={styles.picker}>
          <Picker.Item label="Select Category" value="" />
          {categories.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
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
          placeholder='Currency code'
          style={styles.input}
        />
        <Picker
          selectedValue={category}
          onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
          style={styles.picker}>
          <Picker.Item label="Select Category" value="" />
          {categories.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
      </Picker>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity
          onPress={handleAddExpense}
          style={styles.button}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
      )}
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

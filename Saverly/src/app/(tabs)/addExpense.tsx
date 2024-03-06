import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import { addExpense } from '../../services/addExpense'; // Ensure this path matches your project structure

const AddExpenseScreen = ({ navigation } : any)  => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currency,setCurrency] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddExpense = async () => {
    if (!category || !amount || !description || !currency) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    setLoading(true);

    try {
      await addExpense(category, amount, description,currency);
      Alert.alert('Success', 'Expense added successfully.');
      setCategory('');
      setAmount('');
      setDescription('');
      setCurrency('');

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
        <TextInput
          value={category}
          onChangeText={setCategory}
          placeholder='Expense Category (e.g., Food, Transport)'
          style={styles.input}
        />
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

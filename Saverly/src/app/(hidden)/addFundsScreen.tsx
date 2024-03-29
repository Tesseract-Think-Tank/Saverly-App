import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import updateAccountBalance from '../../services/addFunds';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet } from 'react-native';
import PageHeader from '@/components/PageHeader';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
const AddFundsScreen = ({ route, navigation }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD'); // Default or user's preference

  const { selectedAccount } = route.params;
  const accountId = selectedAccount.id;
  const currencies = [
    'RON',
    'USD',
    'EUR',
    'GBP'
  ];

  const handleAddFunds = async () => {
    try {
      await updateAccountBalance(accountId, parseFloat(amount), currency);
      alert('Funds added successfully!');
      //fetchDataForUser();
      navigation.goBack();

    } catch (error) {
      alert(error.message);
    }
  };

  return (

    <>
    <TouchableOpacity
    style={styles.backButton}
    onPress={() => router.back()} // Go back to the previous screen
    >
    <AntDesign name="left" size={24} color="black" />
  </TouchableOpacity>
    <PageHeader title='Add Funds'></PageHeader>

    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,backgroundColor:'#33404F'}}>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder='Amount'
        keyboardType='numeric'
        style={styles.input} />
      <Picker
        selectedValue={currency}
        onValueChange={(itemValue) => setCurrency(itemValue)}
        style={styles.picker}>
        {currencies.map((cat, index) => (
          <Picker.Item key={index} label={cat} value={cat} />
        ))}
      </Picker>
      <View style={styles.buttonContainer}>
          <Button title="Add" onPress={handleAddFunds} />
        </View>
    </View></>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    width: '50%',
    backgroundColor:'#00DDA3',
    borderRadius:25,
  },
  container: {
    flex: 1,
    backgroundColor: '#33404F', // Set the background color here
  },
    input: {
        backgroundColor: '#B5C5C3',
        paddingHorizontal: 120,
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
      backButton: {
        position: 'absolute',
        top:20,
        left:20,
        padding: 10,
        borderRadius: 5,
        zIndex:1,
      },
});
export default AddFundsScreen;

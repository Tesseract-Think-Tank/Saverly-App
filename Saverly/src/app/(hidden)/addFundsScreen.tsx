import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import updateAccountBalance from '../../services/addFunds';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet } from 'react-native';

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
      navigation.goBack();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
      <Button title="Add Funds" onPress={handleAddFunds} />
    </View>
  );
};

const styles = StyleSheet.create({
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
});
export default AddFundsScreen;

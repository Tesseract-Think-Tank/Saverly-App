import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, ImageBackground } from 'react-native';
import updateAccountBalance from '../../services/addFunds';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet } from 'react-native';
import PageHeader from '@/components/PageHeader';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import backgroundStyles from "@/services/background";

import FundsSVG from '@/assets/money-68.svg'


const AddFundsScreen = ({ route, navigation }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('RON'); // Default or user's preference

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
    onPress={() => router.push('Accounts')} // Go back to the previous screen
    >
    <AntDesign name="left" size={24} color="#6AD4DD" />
  </TouchableOpacity>
    <PageHeader title='Add Funds'></PageHeader>

    <View style={backgroundStyles.containerWithBGColor}>
        <ImageBackground
        source={require('@/assets/backgroundWoodPattern.png')}
        style={backgroundStyles.background}>
        <View style={styles.container}>
    {/* <View>   */}
      <FundsSVG height={230} width={230} /> 
    {/* </View> */}
    <View style={styles.inputContainer}>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder='Amount'
        keyboardType='numeric'
        style={styles.input} />
      <View style={styles.pickerView}>
        <Picker
          selectedValue={currency}
          onValueChange={(itemValue) => setCurrency(itemValue)}
          style={styles.picker}>
          {currencies.map((cat, index) => (
            <Picker.Item key={index} label={cat} value={cat} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddFunds}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
    </View>
    </ImageBackground>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#2B2D31',
  },
  inputContainer: {
    marginTop: 20,
    marginBottom: '50%',
    width: '80%',
  },
  buttonContainer: {
    height:20,
    marginTop: 20,
    width: '40%',
    backgroundColor:'#6AD4DD',
    borderRadius:25,
    alignItems:'center'
  },
  
  button: {
    backgroundColor: '#6AD4DD',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop:40,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        width:'100%',
        height: 50,
        borderRadius: 10,
        marginTop: 5,
      },
      picker: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        // marginTop: 5,
        width: '100%',
        height: 50,
      },
      backButton: {
        position: 'absolute',
        top:20,
        left:20,
        padding: 10,
        borderRadius: 5,
        zIndex:1,
      },
      pickerView: {
        borderRadius: 10,
        marginTop: 5,
        overflow: 'hidden',
      },
});
export default AddFundsScreen;

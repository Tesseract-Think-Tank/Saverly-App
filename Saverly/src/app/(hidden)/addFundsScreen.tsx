import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, ImageBackground, Keyboard, Alert } from 'react-native';
import updateAccountBalance from '../../services/addFunds';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet } from 'react-native';
import PageHeader from '@/components/PageHeader';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import backgroundStyles from "@/services/background";
import FundsSVG from '@/assets/money-68.svg';

const AddFundsScreen = ({ route, navigation }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('RON');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Handles keyboard visibility for layout adjustments.
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const { selectedAccount } = route.params;
  const accountId = selectedAccount.id;
  const currencies = [
    'RON',
    'USD',
    'EUR',
    'GBP'
  ];

  // Handles adding funds to the selected account.
  const handleAddFunds = async () => {
    try {
      await updateAccountBalance(accountId, parseFloat(amount), currency);
      Alert.alert('Funds added successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('AccountsMain')}
      >
        <AntDesign name="left" size={24} color="#6AD4DD" />
      </TouchableOpacity>
      <PageHeader title='Add Funds' />
      <View style={backgroundStyles.containerWithBGColor}>
        <ImageBackground
          source={require('@/assets/backgroundWoodPattern.png')}
          style={backgroundStyles.background}
        >
          <View style={styles.container}>
            {!isKeyboardVisible && (
              <FundsSVG height={230} width={230} />
            )}
            <View style={styles.inputContainer}>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder='Amount'
                keyboardType='numeric'
                style={styles.input}
              />
              <View style={styles.pickerView}>
                <Picker
                  selectedValue={currency}
                  onValueChange={(itemValue) => setCurrency(itemValue)}
                  style={styles.picker}
                >
                  {currencies.map((cat, index) => (
                    <Picker.Item key={index} label={cat} value={cat} />
                  ))}
                </Picker>
              </View>
              <View style={styles.containerButton}>
                <TouchableOpacity style={styles.button} onPress={handleAddFunds}>
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
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
  },
  inputContainer: {
    marginTop: 20,
    marginBottom: '50%',
    width: '80%',
  },
  buttonContainer: {
    height: 20,
    marginTop: 20,
    width: '40%',
    backgroundColor: '#6AD4DD',
    borderRadius: 25,
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#6AD4DD',
    width: '80%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
    height: 50,
    borderRadius: 10,
    marginTop: 5,
  },
  picker: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    width: '100%',
    height: 50,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  pickerView: {
    borderRadius: 10,
    marginTop: 5,
    overflow: 'hidden',
  },
  containerButton: {
    alignItems: 'center',
  },
});

export default AddFundsScreen;
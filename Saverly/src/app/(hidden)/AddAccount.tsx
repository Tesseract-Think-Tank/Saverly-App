import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Image, ImageBackground, Keyboard } from 'react-native';
import { addAccount, fetchUserAccounts } from '../../services/accountService';
import { AntDesign } from '@expo/vector-icons';
import PageHeader from '@/components/PageHeader';
import { Picker } from '@react-native-picker/picker';
import backgroundStyles from "@/services/background";
import AccountSVG from '@/assets/credit-card-1-16.svg';

const currencies = [
  'RON',
  'USD',
  'EUR',
  'GBP'
];

const AddAccountScreen = ({ navigation }) => {
  const [type, setType] = useState('');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('RON');
  const [loading, setLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Handles adding a new account and updating the state accordingly.
  const handleAddAccount = async () => {
    if (!type || !balance || !currency) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    setLoading(true);

    try {
      await addAccount(type, balance, currency);
      Alert.alert('Success', 'Account added successfully.');
      setType('');
      setBalance('');
      setCurrency('');

      await fetchUserAccounts();
      
      navigation.navigate('AccountsMain');
    } catch (error) {
      console.error('Error adding account:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      navigation.navigate('AccountsMain');
    }
  };

  // Handles the visibility of the keyboard.
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

  return (
    <>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('AccountsMain')}
      >
        <AntDesign name="left" size={24} color="#6AD4DD" />
      </TouchableOpacity>
      <PageHeader title="Add new Account" />
      <View style={backgroundStyles.containerWithBGColor}>
        <ImageBackground
          source={require('@/assets/backgroundWoodPattern.png')}
          style={backgroundStyles.background}
        >
          <View style={styles.container}>
            {!isKeyboardVisible && (
              <AccountSVG height={250} width={250} />
            )}
            <View style={styles.inputContainer}>
              <TextInput
                value={type}
                onChangeText={setType}
                placeholder='Account Type (e.g., Cash, Revolut)'
                style={styles.input}
              />
              <TextInput
                value={balance}
                onChangeText={setBalance}
                placeholder='Initial Balance'
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
              {loading ? (
                <ActivityIndicator size="large" color="#6AD4DD" />
              ) : (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={handleAddAccount}
                    style={styles.button}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>Add Account</Text>
                  </TouchableOpacity>
                </View>
              )}
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
  logo: {
    width: 250,
    height: 170,
    marginBottom: 20,
  },
  title: {
    color: '#00DDA3',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 150,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    height: 50,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  picker: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#6AD4DD',
    width: '80%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 15,
    borderColor: '#6C63FF',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  pickerView: {
    borderRadius: 10,
    marginTop: 5,
    overflow: 'hidden',
  },
});

export default AddAccountScreen;
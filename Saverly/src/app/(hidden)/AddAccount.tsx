import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Image, ImageBackground } from 'react-native';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../firebaseConfig';
import { fetchDataForUser } from '../../services/firebaseServices';
import { addAccount, fetchUserAccounts } from '../../services/accountService';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import PageHeader from '@/components/PageHeader';
import { Picker } from '@react-native-picker/picker';
import backgroundStyles from "@/services/background";


const currencies = [
  'RON',
  'USD',
  'EUR',
  'GBP'
];
const AddAccountScreen = () => {
  const [type, setType] = useState('');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('RON');
  const [loading, setLoading] = useState(false);

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
      
      router.back; // Navigate back to the previous screen
    } catch (error: any) {
      console.error('Error adding account:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      router.push('Accounts');
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
    <PageHeader title="Add new Account" />
    <View style={backgroundStyles.containerWithBGColor}>
        <ImageBackground
        source={require('@/assets/backgroundWoodPattern.png')}
        style={backgroundStyles.background}>
        <View style={styles.container}>
      <Image source={require('../../assets/card.png')} style={styles.logo} />
      <View style={styles.inputContainer}>
        <TextInput
          value={type}
          onChangeText={setType}
          placeholder='Account Type (e.g., Cash, Revolut)'
          style={styles.input} />
        <TextInput
          value={balance}
          onChangeText={setBalance}
          placeholder='Initial Balance'
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
    logo: {
        width: 250,
        height: 170,
        marginBottom: 20,
    },
    title: {
        color:'#00DDA3',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        width: '80%',
    },
    backButton: {
      position: 'absolute',
      top:20,
      left:20,
      padding: 10,
      borderRadius: 5,
      zIndex:1,
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
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    picker: {
      backgroundColor: '#fff',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      // marginTop: 5,
      height: 50,
      width: '100%', 
    },
    button: {
        backgroundColor: '#6AD4DD',
        width: '100%',
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

import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../../firebaseConfig';
import { fetchDataForUser } from '../../services/firebaseServices';
import { addAccount, fetchUserAccounts } from '../../services/accountService';

const AddAccountScreen = ({ navigation }: any) => {
  const [type, setType] = useState('');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('');
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
      
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error: any) {
      console.error('Error adding account:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/card.png')} style={styles.logo} />  
      <Text style={styles.title}>Add New Account</Text>
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
      <TextInput
        value={currency}
        onChangeText={setCurrency}
        placeholder='Currency (e.g., USD, EUR)'
        style={styles.input}
      />
        </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
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
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    logo: {
        width: 250,
        height: 170,
        marginBottom: 20,
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
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#6C63FF',
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
});

export default AddAccountScreen;

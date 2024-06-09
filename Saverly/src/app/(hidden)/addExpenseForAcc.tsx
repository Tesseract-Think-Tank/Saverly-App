import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Keyboard
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addExpenseForAcc } from '../../services/addExpenseForAcc';
import PageHeader from '@/components/PageHeader';
import { AntDesign } from '@expo/vector-icons';
import backgroundStyles from "@/services/background";
import ExpenseSVG from '@/assets/online-payment-1-62.svg';

const AddExpenseForAccScreen = ({ route, navigation }) => {
  const { selectedAccount } = route.params || {};
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('RON');
  const [loading, setLoading] = useState(false);
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

  // Handles adding a new expense and updating the state accordingly.
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
    navigation.navigate('AccountsMain');
  };

  return (
    <>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('AccountsMain')}
      >
        <AntDesign name="left" size={24} color="#6AD4DD" />
      </TouchableOpacity>
      <PageHeader title="Add an expense" />
      <View style={backgroundStyles.containerWithBGColor}>
        <ImageBackground
          source={require('@/assets/backgroundWoodPattern.png')}
          style={backgroundStyles.background}
        >
          <View style={styles.container}>
            {!isKeyboardVisible && (
              <ExpenseSVG height={180} width={200} />
            )}
            <View style={styles.inputContainer}>
              <View style={styles.pickerView}>
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                  style={styles.picker}
                >
                  {categories.map((cat, index) => (
                    <Picker.Item key={index} label={cat} value={cat} />
                  ))}
                </Picker>
              </View>
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
                <View style={styles.containerButton}>
                  <TouchableOpacity
                    onPress={handleAddExpense}
                    style={styles.button}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>Add Expense</Text>
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
  containerButton: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6AD4DD',
  },
  inputContainer: {
    width: '80%',
    marginBottom: '40%',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    height: 50,
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
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
    width: '80%',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pickerView: {
    borderRadius: 10,
    marginTop: 5,
    overflow: 'hidden',
  },
});

export default AddExpenseForAccScreen;
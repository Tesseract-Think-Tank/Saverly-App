import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import { addMonthlyPayment, fetchUserMonthlyPayments } from '../../services/monthlyPaymentService';
import { MonthlyPayment } from '../../services/monthlyPaymentService';
import { router } from 'expo-router';
import { scheduleMonthlyNotifications } from '../../services/Notifications';
import DatePicker from '@react-native-community/datetimepicker';
import PageHeader from '@/components/PageHeader';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { getAccounts } from '@/services/addExpense';
import backgroundStyles from "@/services/background";

import MonthPaySVG from '@/assets/calendar-31.svg'


const AddMonthlyPaymentScreen = () => {
  const [businessName, setBusinessName] = useState('');
  const [cost, setCost] = useState('');
  const [currency, setCurrency] = useState('RON');
  const [date, setDate] = useState(new Date()); // Initialize date state with current date
  const [cardHolderName, setCardHolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false); // State to control date picker visibility
  const currencies = [
    'RON',
    'USD',
    'EUR',
    'GBP'
  ];
  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true);
      try {
        const fetchedAccounts = await getAccounts(); 
        setAccounts(fetchedAccounts);
        setSelectedAccount(fetchedAccounts[0]); 
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch accounts');
      }
      setLoading(false);
    };

    loadAccounts();
  }, []);
  const handleAddMonthlyPayment = async () => {
    const monthlyPayment = new MonthlyPayment(businessName, cost, currency, date.getDate().toString(), cardHolderName);

    if (!monthlyPayment.getBusinessName() || !monthlyPayment.getCost() || !monthlyPayment.getCurrency() || !monthlyPayment.getDate()) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    setLoading(true);

    try {
      await addMonthlyPayment(monthlyPayment);
      Alert.alert('Success', 'Monthly payment added successfully.');
      setBusinessName('');
      setCost('');
      setCurrency('');
      setDate(new Date()); // Reset date to current date
      setCardHolderName('');
      const notificationDate = new Date(date);
      notificationDate.setDate(notificationDate.getDate() - 1);
      // Set hours to 12
      notificationDate.setHours(12);
      // Set minutes to 00
      notificationDate.setMinutes(0);
      // Set seconds to 00
      notificationDate.setSeconds(0);
      monthlyPayment.setDate(date.toDateString);
      scheduleMonthlyNotifications(notificationDate, monthlyPayment.getBusinessName());
      await fetchUserMonthlyPayments();
      router.back(); // Navigate back to the previous screen
    } catch (error) {
      console.error('Error adding monthly payment:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      router.push('Month');
    }
  };

  return (
    <>
    <TouchableOpacity
    style={styles.backButton}
    onPress={() => router.back()} // Go back to the previous screen
    >
    <AntDesign name="left" size={24} color="#6AD4DD" />
  </TouchableOpacity><PageHeader title="Add new Monthly Payment"></PageHeader>
  <View style={backgroundStyles.containerWithBGColor}>
        <ImageBackground
        source={require('@/assets/backgroundWoodPattern.png')}
        style={backgroundStyles.background}>
        <View style={styles.container}>
      <MonthPaySVG height={200} width={200} />
      <View style={styles.inputContainer}>
        <TextInput
          value={businessName}
          onChangeText={text => setBusinessName(text)}
          placeholder='Business Name'
          style={styles.input} />
        <TextInput
          value={cost}
          onChangeText={text => setCost(text)}
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
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.input}>
            {date.toDateString()}
          </Text>
        </TouchableOpacity>
        <View style={styles.datePickerView}>
        {showDatePicker && (
          <DatePicker
            value={date}
            mode='date'
            display='spinner'
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              setDate(selectedDate || date); // Update date state with selected date or keep the previous date
            }}
            style={styles.datePicker} />
        )}
        </View>
        <View style={styles.pickerView}>
        <Picker
          selectedValue={cardHolderName}
          onValueChange={(itemValue) => setCardHolderName(itemValue)}
          style={styles.picker}>
          {accounts.map((account) => (
            <Picker.Item
              key={`${account.currency}_${account.type}`}
              label={`${account.type} - ${account.currency}`}
              value={`${account.currency}_${account.type}`} />
          ))}
        </Picker>
        </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleAddMonthlyPayment}
          style={styles.button}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Add Monthly Payment</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#6AD4DD" />}
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
    // backgroundColor: '#33404F',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#6AD4DD'
  },
  inputContainer: {
    width: '80%',
    marginBottom: '35%',
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
    // marginTop: 5,
    height: 50,
    width: '100%', 
  },
  datePicker: {
    height: 50,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
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
  datePickerView: {
    borderRadius: 10,
    // marginTop: 5,
    overflow: 'hidden',
  },
});

export default AddMonthlyPaymentScreen;
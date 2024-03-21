import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { addMonthlyPayment, fetchUserMonthlyPayments } from '../../services/monthlyPaymentService';
import { MonthlyPayment } from '../../services/monthlyPaymentService';
import { router } from 'expo-router';
import { scheduleMonthlyNotifications } from '../../services/Notifications';
import DatePicker from '@react-native-community/datetimepicker';

const AddMonthlyPaymentScreen = () => {
  const [businessName, setBusinessName] = useState('');
  const [cost, setCost] = useState('');
  const [currency, setCurrency] = useState('');
  const [date, setDate] = useState(new Date()); // Initialize date state with current date
  const [cardHolderName, setCardHolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false); // State to control date picker visibility

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
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Monthly Payment</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={businessName}
          onChangeText={text => setBusinessName(text)}
          placeholder='Business Name'
          style={styles.input}
        />
        <TextInput
          value={cost}
          onChangeText={text => setCost(text)}
          placeholder='Amount'
          keyboardType='numeric'
          style={styles.input}
        />
        <TextInput
          value={currency}
          onChangeText={text => setCurrency(text)}
          placeholder='Currency (e.g., USD, EUR)'
          style={styles.input}
        />
        {/* Replace TextInput with DatePicker */}
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.input}>
            {date.toDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DatePicker
            value={date}
            mode='date'
            display='spinner'
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              setDate(selectedDate || date); // Update date state with selected date or keep the previous date
            }}
          />
        )}
        <TextInput
          value={cardHolderName}
          onChangeText={text => setCardHolderName(text)}
          placeholder='Card Holder Name'
          style={styles.input}
        />
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
      {loading && <ActivityIndicator size="large" color="#00DDA3" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#33404F',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#00DDA3'
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: '#fff',
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
    backgroundColor: '#00DDA3',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddMonthlyPaymentScreen;
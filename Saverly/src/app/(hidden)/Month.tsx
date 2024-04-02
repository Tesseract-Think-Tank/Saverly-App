import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { fetchUserMonthlyPayments, removeMonthlyPayment, MonthlyPayment } from '../../services/monthlyPaymentService'; // Adjust the import path as necessary
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import TabLayout from '../(tabs)/_layout'
import { AntDesign } from '@expo/vector-icons';
import PageHeader from '@/components/PageHeader';

const { width } = Dimensions.get('window');

const MonthlyPaymentCard = ({ monthlyPayment, removePayment }: { monthlyPayment: MonthlyPayment, removePayment: (businessName: string) => void }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{monthlyPayment.businessName}</Text>
    <Text>{`Amount: ${monthlyPayment.cost} ${monthlyPayment.currency}`}</Text>
    <Text>{`Payment every month on ${monthlyPayment.date}`}</Text>
    <TouchableOpacity onPress={() => removePayment(monthlyPayment.businessName)} style={styles.removeButton}>
      <Ionicons name="trash-bin-outline" style={styles.icon}/>
    </TouchableOpacity>
  </View>
);

const MonthlyPaymentsScreen = ({ }: any) => {
  const [monthlyPayments, setMonthlyPayments] = useState<MonthlyPayment[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const loadMonthlyPayments = async () => {
        setLoading(true);
        try {
          const fetchedMonthlyPayments = await fetchUserMonthlyPayments();
          setMonthlyPayments(fetchedMonthlyPayments as MonthlyPayment[]);
        } catch (error) {
          Alert.alert('Error', 'Failed to fetch monthly payments.');
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      loadMonthlyPayments();
      return () => {
        // Cleanup actions if required
      };
    }, [])
  );

  const removePayment = async (businessName: string) => {
    try {
      // Find the payment with the specified business name
      const paymentToRemove = monthlyPayments.find(payment => payment.businessName === businessName);

      if (!paymentToRemove) {
        throw new Error('Payment not found.');
      }

      // Call the removeMonthlyPayment function from the service
      const success = await removeMonthlyPayment(paymentToRemove);
      if (success) {
        // Remove the payment from the local state
        setMonthlyPayments(monthlyPayments.filter(payment => payment.businessName !== businessName));
        Alert.alert('Success', 'Monthly payment removed successfully.');
      } else {
        throw new Error('Failed to remove monthly payment.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to remove monthly payment.');
      console.error(error);
    }
  };

  return (
    <>
    <TouchableOpacity
    style={styles.backButton}
    onPress={() => router.push('Settings')} // Go back to the previous screen
  >
    <AntDesign name="left" size={24} color="#6AD4DD" />
  </TouchableOpacity>
    <PageHeader title="Monthly Expenses" />
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={{ backgroundColor: '#2B2D31' }}>
        {loading ? <Text>Loading monthly payments...</Text> : monthlyPayments.map((payment: MonthlyPayment) => (
          <MonthlyPaymentCard key={payment.businessName} monthlyPayment={payment} removePayment={removePayment} />
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('AddMonth')}
        activeOpacity={0.7} // Optional: reduce the opacity on touch
      >
        <Ionicons name='add' size={24} color="white" />
      </TouchableOpacity>
    </View></> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor:'#2B2D31'
  },
  card: {
    marginTop:100,
    backgroundColor: '#FFF',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  fab: {
    position: 'absolute',
    right: (width-56) / 2, // Adjust this value based on your screen width and FAB width (56
    bottom: 110, // Adjust this value based on your tab bar height
    backgroundColor: '#6AD4DD', // Use your app's theme color
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#333',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 5, height: 5 },
  },
  backButton: {
    position: 'absolute',
    top:20,
    left:20,
    padding: 10,
    borderRadius: 5,
    zIndex:1,
  },
  icon: {
    color: '#6AD4DD',
    fontSize: 30,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#FFF', // Adjust the color as necessary
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginLeft: 250,
    marginTop:15,
    position:'absolute',
    left:20,
  },
  removeButtonText: {
    color: 'white', // Adjust the color as necessary
    fontWeight: 'bold',
  },
});

export default MonthlyPaymentsScreen;
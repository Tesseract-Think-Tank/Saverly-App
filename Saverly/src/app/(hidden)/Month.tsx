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
    <AntDesign name="left" size={24} color="black" />
  </TouchableOpacity>
    <PageHeader title="Monthly Expenses" />
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={{ backgroundColor: '#33404F' }}>
        {loading ? <Text>Loading monthly payments...</Text> : monthlyPayments.map((payment: MonthlyPayment) => (
          <MonthlyPaymentCard key={payment.businessName} monthlyPayment={payment} removePayment={removePayment} />
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
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
    backgroundColor:'#33404F'
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
  addButton: {
    position: 'absolute', // Position over your other content
    right: (width - 56) / 2, // 30 units from the right
    bottom: 60, // 30 units from the bottom
    backgroundColor: '#B5C5C3', // Replace with the color of your choice
    width: 56, // Diameter of the FAB
    height: 56, // Diameter of the FAB
    borderRadius: 28, // Half the size of width & height to make it perfectly round
    justifyContent: 'center', // Center the '+' icon vertically
    alignItems: 'center', // Center the '+' icon horizontally
    shadowColor: '#89CFF3', // Shadow Color
    shadowOpacity: 0.5, // Shadow Opacity
    shadowRadius: 5, // Shadow Radius
    shadowOffset: { height: 5, width: 5 }, // Shadow Offset
    elevation: 6, // This adds a shadow on Android
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
    color: '#00DDA3',
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
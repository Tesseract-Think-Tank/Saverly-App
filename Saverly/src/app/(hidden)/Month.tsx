import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Dimensions, Image as RNImage, ImageBackground } from 'react-native';
import { fetchUserMonthlyPayments, removeMonthlyPayment, MonthlyPayment } from '../../services/monthlyPaymentService';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import PageHeader from '@/components/PageHeader';
import backgroundStyles from "@/services/background";

type ImageProps = React.ComponentProps<typeof RNImage>;
const Image: React.ComponentType<ImageProps> = RNImage;
const { width } = Dimensions.get('window');
const category_images = {
  'Youtube': require("../../assets/youtube-removebg-preview.png"),
  'Youtube Music': require("../../assets/youtube-music.png"),
  'Spotify': require("../../assets/spotify.png"),
  'Netflix': require("../../assets/netflix.png"),
  'Apple Music': require("../../assets/health.png"),
  'Moovit': require("../../assets/moovit2.png"),
  'Disney Plus': require("../../assets/disney_2.png"),
  'Flight Radar': require("../../assets/plane3.png"),
};

// Card component for displaying a monthly payment
const MonthlyPaymentCard = ({ monthlyPayment, removePayment }: { monthlyPayment: MonthlyPayment, removePayment: (businessName: string) => void }) => (
  <View style={styles.card2}>
    <View style={styles.cardRow}>
      <View style={styles.circle_for_expenses}>
        {category_images[monthlyPayment.businessName] ? (
          <Image source={category_images[monthlyPayment.businessName]} style={styles.image} />
        ) : (
          <Ionicons name="calendar-clear-outline" size={22} color="#000" />
        )}
      </View>
      <View style={styles.cardMiddle}>
        <Text style={styles.cardCategory}>{monthlyPayment.businessName}</Text>
        <Text style={styles.cardDescription}>Payment every month on {monthlyPayment.date}</Text>
      </View>
      <Text style={styles.cardAmount}>{monthlyPayment.cost}</Text>
      <Text style={styles.cardCurrency}>{monthlyPayment.currency}</Text>
      <TouchableOpacity onPress={() => removePayment(monthlyPayment.businessName)} style={styles.removeButton}>
        <Ionicons name="trash-bin-outline" size={22} color="#6AD4DD" />
      </TouchableOpacity>
    </View>
  </View>
);

// Screen component for displaying all monthly payments
const MonthlyPaymentsScreen = ({ navigation }) => {
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

  // Handles the removal of a monthly payment
  const removePayment = async (businessName: string) => {
    try {
      const paymentToRemove = monthlyPayments.find(payment => payment.businessName === businessName);

      if (!paymentToRemove) {
        throw new Error('Payment not found.');
      }

      const success = await removeMonthlyPayment(paymentToRemove);
      if (success) {
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
        onPress={() => navigation.navigate('MonthMain')}
      >
        <AntDesign name="left" size={24} color="#6AD4DD" />
      </TouchableOpacity>
      <PageHeader title="Monthly Expenses" />
      <View style={backgroundStyles.containerWithBGColor}>
        <ImageBackground
          source={require('@/assets/backgroundWoodPattern.png')}
          style={backgroundStyles.background}
        >
          <View style={styles.container}>
            <ScrollView style={styles.container2}>
              {loading ? (
                <Text>Loading monthly payments...</Text>
              ) : monthlyPayments.length === 0 ? (
                <View style={styles.card}>
                  <View style={styles.cardRow}>
                    <View style={styles.circle_for_expenses}>
                      <Ionicons name="eye-off-outline" size={22} color="black" />
                    </View>
                    <View style={styles.cardMiddle}>
                      <Text style={styles.cardCategory}>No expenses found for this account</Text>
                    </View>
                  </View>
                </View>
              ) : (
                monthlyPayments.map((payment: MonthlyPayment) => (
                  <MonthlyPaymentCard
                    key={payment.businessName}
                    monthlyPayment={payment}
                    removePayment={removePayment}
                  />
                ))
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.fab}
              onPress={() => navigation.navigate('AddMonthExp')}
              activeOpacity={0.7}
            >
              <Ionicons name='add' size={24} color="white" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  container2: {
    marginTop: 10,
    flex: 1,
    padding: 10,
  },
  card: {
    marginTop: 0,
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
    right: (width - 56) / 2,
    bottom: 110,
    backgroundColor: '#6AD4DD',
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
    top: 20,
    left: 20,
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
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
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginLeft: 250,
    marginTop: 15,
    position: 'absolute',
    left: 40,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  circle_for_expenses: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: '#6AD4DD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card2: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardMiddle: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 16,
  },
  cardCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#33404F',
  },
  cardDescription: {
    paddingTop: 5,
    fontSize: 14,
    color: '#999',
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
  cardAmount: {
    top: 5,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    position: 'absolute',
    left: 210,
    alignSelf: 'center',
  },
  cardCurrency: {
    bottom: 7,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    alignSelf: 'center',
    right: 55,
  },
  image: {
    width: 30,
    height: 30,
  },
});

export default MonthlyPaymentsScreen;
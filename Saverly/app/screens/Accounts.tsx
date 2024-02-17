// AccountsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { fetchUserAccounts } from '../services/accountService'; // Adjust the import path as necessary
import { Ionicons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');

const AccountCard = ({ type, balance, currency }: { type: string, balance: number, currency: string }) => (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>{type}</Text>
        <Text>{`Balance: ${balance} ${currency}`}</Text>
    </View>
);

const AccountsScreen = ({ navigation }: any) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAccounts = async () => {
        setLoading(true);
        try {
            const fetchedAccounts = await fetchUserAccounts();
            setAccounts(fetchedAccounts as never[]);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch accounts.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    loadAccounts();
  }, []);

return (
    <View style={styles.container}>
        <ScrollView style={styles.container}>
            {loading ? <Text>Loading accounts...</Text> : accounts.map((account: { id: string, type: string, balance: number, currency: string }) => (
                <AccountCard key={account.id} type={account.type} balance={account.balance} currency={account.currency} />
            ))}
    
        </ScrollView>
        <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddAccount')}
        activeOpacity={0.7} // Optional: reduce the opacity on touch
      >
        <Ionicons name='add' size={24} color="white" />
      </TouchableOpacity>
    </View>
    
    
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
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
    backgroundColor: '#7e57c2', // Replace with the color of your choice
    width: 56, // Diameter of the FAB
    height: 56, // Diameter of the FAB
    borderRadius: 28, // Half the size of width & height to make it perfectly round
    justifyContent: 'center', // Center the '+' icon vertically
    alignItems: 'center', // Center the '+' icon horizontally
    shadowColor: '#9e9e9e', // Shadow Color
    shadowOpacity: 0.5, // Shadow Opacity
    shadowRadius: 5, // Shadow Radius
    shadowOffset: { height: 5, width: 5 }, // Shadow Offset
    elevation: 6, // This adds a shadow on Android
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AccountsScreen;

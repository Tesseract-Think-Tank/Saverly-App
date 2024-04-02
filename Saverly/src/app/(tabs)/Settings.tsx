import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import MonthlyRecap from '../(hidden)/MonthlyRecap';
import { Ionicons } from '@expo/vector-icons';
import PageHeader from '../../components/PageHeader';

const { width } = Dimensions.get('window');

const Settings = () => {
  return (
    <View className='flex-1'>
      <PageHeader title='Month Recap'></PageHeader>
      <MonthlyRecap></MonthlyRecap>
      <TouchableOpacity onPress={() => router.push('Month')} style={styles.buttonexpense}>
      <View style={[styles.buttonHalf, { backgroundColor: '#6AD4DD' }]} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="wallet-outline" style={styles.icon1} />
        <Text style={styles.buttonText}>Monthly Expenses</Text>
        </View>
      </TouchableOpacity>
      
    </View>
  )
}
const styles = StyleSheet.create({
  buttonexpense: {
    position:'absolute',
    backgroundColor: '#fff',
    padding: 10,
    height: 80, // increase the height
    width: 330,
    left:30,
    top: 100,
    alignItems: 'center', // center the text horizontally
    justifyContent: 'center',
    borderRadius: 10, // add borderRadius property
    overflow: 'hidden',
  },
  buttongoal: {
    position:'absolute',
    backgroundColor: '#B5C5C3',
    padding: 10,
    height: 80, // increase the height
    width: 330,
    left: (width - 330) / 2,
    bottom: 150, // move the button lower
    alignItems: 'center', // center the text horizontally
    justifyContent: 'center',
    borderRadius: 10, // add borderRadius property
    overflow: 'hidden',
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
  },
  icon1: {
    right:50,
    color: '#000',
    fontSize: 30,
  },
  icon2: {
    right:75,
    color: '#000',
    fontSize: 30,
  },
  buttonHalf: {
    height: '150%',
    width: '50%',
    position: 'absolute',
    right: 240,
    top: -5,
    bottom:5,
    borderRadius:40,
  },
});

export default Settings
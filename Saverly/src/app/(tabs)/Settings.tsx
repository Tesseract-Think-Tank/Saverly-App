import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import MonthlyRecap from '../(hidden)/MonthlyRecap';
import { Ionicons } from '@expo/vector-icons';
import PageHeader from '../../components/PageHeader';
import backgroundStyles from "@/services/background";


const { width } = Dimensions.get('window');

const Settings = () => {
  return (
    <View className='flex-1'>
      <View style={backgroundStyles.containerWithBGColor}>
        <ImageBackground
        source={require('@/assets/backgroundWoodPattern.png')}
        style={backgroundStyles.background}>
        <View style={styles.container}>
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
    </ImageBackground>
    </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: '#2B2D31',
  },
  buttonexpense: {
    position:'absolute',
    backgroundColor: '#fff',
    padding: 10,
    height: 80, // increase the height
    width: 330,
    left: (width - 330) / 2,
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
    right: 250,
    top: -5,
    bottom:5,
    borderRadius:50,
  },
});

export default Settings
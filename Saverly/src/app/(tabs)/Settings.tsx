import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { router } from 'expo-router';

const Settings = ({ navigation }: any) => {
  return (
    <View className='flex-1'>
      <TouchableOpacity
      style={styles.button}
      onPress={() => {
        
        router.push('MonthlyRecap')}}>
        <Text style={styles.buttonText}>MonthlyRecap</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#bfffff',
    height: 50,
    padding: 10,
  },
  buttonText: {
    color: '#000010',
    fontSize: 20,
  },
});

export default Settings
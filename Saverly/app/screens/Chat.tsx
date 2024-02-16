import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';

const Chat = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState('');
  const [userInput, setUserInput] = useState('');

  const handlePressFoodOption = async (optionIndex: any) => {
    if ((optionIndex === 2 || optionIndex === 4) && !userInput.trim()) {
      Alert.alert("Input Required", "Please provide some input for this option.");
      return;
    }

    const url = `http://192.168.1.6:5000/food-question-${optionIndex + 1}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setDisplayText(data.response);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch response from the server.');
      console.error(error);
    }
  };

  const handlePressRentOption = async (optionIndex: any) => {
    if (!userInput.trim()) {
      Alert.alert("Input Required", "Please provide some input for this option.");
      return;
    }

    const url = `http://192.168.1.6:5000/rent-question-${optionIndex + 1}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setDisplayText(data.response);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch response from the server.');
      console.error(error);
    }
  };

  const handlePressTravelOption = async (optionIndex: any) => {
    if ((optionIndex === 0 || optionIndex === 2 || optionIndex === 3) && !userInput.trim()) {
      Alert.alert("Input Required", "Please provide some input for this option.");
      return;
    }

    const url = `http://192.168.1.6:5000/travel-question-${optionIndex + 1}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setDisplayText(data.response);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch response from the server.');
      console.error(error);
    }
  };
  

  const renderCategoryButtons = () => (
    ['Rent', 'Food', 'Travel'].map(category => (
      <TouchableOpacity key={category} style={styles.button} onPress={() => setActiveCategory(category)}>
        <Text>{category}</Text>
      </TouchableOpacity>
    ))
  );

  const renderFoodOptionButtons = () => (
    ['Easy to make dishes', 'Low budget meals', 'Food cheaper than X', 'Week plan to save time/money', 'Substitute for ingredient X'].map((option, index) => (
      <TouchableOpacity key={option} style={styles.button} onPress={() => handlePressFoodOption(index)}>
        <Text>{option}</Text>
      </TouchableOpacity>
    ))
  );

  const renderRentOptionButtons = () => (
    ['Average monthly rent', 'Average rent in city areas', 'Public transport', 'Average student living cost', 'Average living cost compared to other cities'].map((option, index) => (
      <TouchableOpacity key={option} style={styles.button} onPress={() => handlePressRentOption(index)}>
        <Text>{option}</Text>
      </TouchableOpacity>
    ))
  );

  const renderTravelOptionButtons = () => (
    ['Must visit places', 'Cost-effective traveling', 'Affordable/free activities', 'Perfect time to vist', 'Cheap cities in Europe'].map((option, index) => (
      <TouchableOpacity key={option} style={styles.button} onPress={() => handlePressTravelOption(index)}>
        <Text>{option}</Text>
      </TouchableOpacity>
    ))
  );

  return (
    <View style={styles.container}>
      {activeCategory ? (
        <>
          {activeCategory === 'Food' && renderFoodOptionButtons()}
          {activeCategory === 'Rent' && renderRentOptionButtons()}
          {activeCategory === 'Travel' && renderTravelOptionButtons()}
          <TouchableOpacity style={styles.button} onPress={() => setActiveCategory(null)}>
            <Text>Back</Text>
          </TouchableOpacity>
        </>
      ) : renderCategoryButtons()}

      <Text style={styles.inputLabel}>User Input:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUserInput}
        value={userInput}
        placeholder="Enter your input here"
      />

    <ScrollView 
      style={styles.displayBox}
      contentContainerStyle={styles.displayBoxContent}
    >
      <Text>{displayText}</Text>
    </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  displayBox: {
    width: '80%',
    height: 100, // You can adjust the height as needed
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  displayBoxContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: 'gray',
    borderRadius: 5,
  },
  inputLabel: {
    marginTop: 10,
  },
});

export default Chat;

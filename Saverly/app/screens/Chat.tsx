import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState('');
  const [userInput, setUserInput] = useState('');

  const handlePressFoodOption = async (optionIndex: any) => {
    if ((optionIndex === 2 || optionIndex === 4) && !userInput.trim()) {
      Alert.alert("Input Required", "Please provide some input for this option.");
      return;
    }

    const url = `http://localhost:5000/food-question-${optionIndex + 1}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }), // Include userInput pentru opțiunile relevante
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setDisplayText(data.response); // Actualizează UI-ul cu răspunsul primit
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
    ['Easy to make dishes', 'Low budget meals', 'Food option 3', 'Food option 4', 'Food option 5'].map((option, index) => (
      <TouchableOpacity key={option} style={styles.button} onPress={() => handlePressFoodOption(index)}>
        <Text>{option}</Text>
      </TouchableOpacity>
    ))
  );

  return (
    <View style={styles.container}>
      {activeCategory ? (
        <>
          {activeCategory === 'Food' ? renderFoodOptionButtons() : <Text>Select a category.</Text>}
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

      <View style={styles.displayBox}>
        <Text>{displayText}</Text>
      </View>
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
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
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

export default Home;

import React, { useState } from 'react';
<<<<<<< HEAD
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';

const Home = () => {
=======
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';

const Chat = () => {
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
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
<<<<<<< HEAD
        body: JSON.stringify({ userInput }), // Include userInput pentru opțiunile relevante
=======
        body: JSON.stringify({ userInput }),
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
<<<<<<< HEAD
      setDisplayText(data.response); // Actualizează UI-ul cu răspunsul primit
=======
      setDisplayText(data.response);
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch response from the server.');
      console.error(error);
    }
  };

<<<<<<< HEAD
=======
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
  

>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
  const renderCategoryButtons = () => (
    ['Rent', 'Food', 'Travel'].map(category => (
      <TouchableOpacity key={category} style={styles.button} onPress={() => setActiveCategory(category)}>
        <Text>{category}</Text>
      </TouchableOpacity>
    ))
  );

  const renderFoodOptionButtons = () => (
<<<<<<< HEAD
    ['Easy to make dishes', 'Low budget meals', 'Food option 3', 'Food option 4', 'Food option 5'].map((option, index) => (
=======
    ['Easy to make dishes', 'Low budget meals', 'Food cheaper than X', 'Week plan to save time/money', 'Substitute for ingredient X'].map((option, index) => (
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
      <TouchableOpacity key={option} style={styles.button} onPress={() => handlePressFoodOption(index)}>
        <Text>{option}</Text>
      </TouchableOpacity>
    ))
  );

<<<<<<< HEAD
=======
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

>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
  return (
    <View style={styles.container}>
      {activeCategory ? (
        <>
<<<<<<< HEAD
          {activeCategory === 'Food' ? renderFoodOptionButtons() : <Text>Select a category.</Text>}
=======
          {activeCategory === 'Food' && renderFoodOptionButtons()}
          {activeCategory === 'Rent' && renderRentOptionButtons()}
          {activeCategory === 'Travel' && renderTravelOptionButtons()}
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
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

<<<<<<< HEAD
      <View style={styles.displayBox}>
        <Text>{displayText}</Text>
      </View>
=======
    <ScrollView 
      style={styles.displayBox}
      contentContainerStyle={styles.displayBoxContent}
    >
      <Text>{displayText}</Text>
    </ScrollView>
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
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
<<<<<<< HEAD
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
=======
    height: 100, // You can adjust the height as needed
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
<<<<<<< HEAD
=======
  displayBoxContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
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

<<<<<<< HEAD
export default Home;
=======
export default Chat;
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451

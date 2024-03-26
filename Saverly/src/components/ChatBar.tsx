import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useChat } from '@/services/chatContext';

const ChatBar = () => {
  const [isActive, setIsActive] = useState(false);
  const [showRentMenu, setShowRentMenu] = useState(false);
  const [showFoodMenu, setShowFoodMenu] = useState(false);
  const [showTravelMenu, setShowTravelMenu] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);


  // Animated values
  const opacityAnim = useState(new Animated.Value(0))[0]; // Initial opacity is 0 to hide the buttons
  const translateAnim = useState(new Animated.Value(50))[0]; // Start with buttons translated down

  // Inside ChatBar component
  const { sendMessage } = useChat();
  const [inputText, setInputText] = useState('');

  const handleSend = async () => {
    if (inputText.trim()) {
        // Append user's message to the history
        const updatedHistory = conversationHistory.concat([{
            role: "user",
            content: inputText.trim(),
        }]);
        
        // console.log(inputText);
        sendMessage(inputText);
        setInputText('');

        const url = `http://192.168.1.16:5000/default-question`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    question: inputText,
                    history: updatedHistory, // Send the updated history to the backend
                }),
            });

            setInputText('');

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data && data.response) {
                // Append bot's response to the history
                const newHistory = updatedHistory.concat([{
                    role: "assistant",
                    content: data.response,
                }]);

                // Update the conversation history state
                setConversationHistory(newHistory);

                // Send the server's response as an 'incoming' message
                sendMessage(data.response, 'incoming');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch response from the server.');
            console.error(error);
        }
        // setInputText('');
    }
};

  
const handleCategoryOptionPress = async (category, optionIndex) => {
  const userInput = inputText; // This uses the inputText state from ChatBar
  let url = `http://192.168.1.16:5000`;
  // Define an array of options that require userInput
  const optionsRequiringInput = {
      food: [2, 4], // 0-indexed, corresponding to food-question-3 and food-question-5
      rent: [0, 1, 2, 3, 4], // All rent questions
      travel: [0, 2, 3] // corresponds to travel-question-1, travel-question-3, travel-question-4
  };

  if (optionsRequiringInput[category].includes(optionIndex) && !userInput.trim()) {
      Alert.alert("Input Needed", "Please provide input for this question.");
      return; // Return early to prevent making a server request
  }
  
  switch(category) {
      case 'food':
          url += `/food-question-${optionIndex + 1}`;
          break;
      case 'rent':
          url += `/rent-question-${optionIndex + 1}`;
          break;
      case 'travel':
          url += `/travel-question-${optionIndex + 1}`;
          break;
      default:
          console.error('Unknown category');
          return;
  }

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              userInput, // Send user input as is
              history: conversationHistory, // Send the current history
          }),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data && data.response) {
          // The backend should append user input and bot response to the history
          setConversationHistory(data.history); // Update the frontend history based on the backend response

          // Send the server's response as an 'incoming' message
          sendMessage(data.response, 'incoming');
      }
  } catch (error) {
      Alert.alert('Error', 'Failed to fetch response from the server.');
      console.error(error);
  }
  setInputText(''); // Clear input text after handling
};

  
  const toggle = () => {
    const anyMenuOpen = showRentMenu || showFoodMenu || showTravelMenu;
  
    if (anyMenuOpen) {
      // Close all menus
      setShowRentMenu(false);
      setShowFoodMenu(false);
      setShowTravelMenu(false);
      // Ensure the chat bar buttons show up after closing the menu
      if (!isActive) {
        setIsActive(true);
      }
      // Trigger the animation to reveal the chat bar buttons
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      setIsActive(!isActive);
  
      // Adjust the animation based on the new state of isActive
      const targetOpacity = isActive ? 0 : 1;
      const targetTranslation = isActive ? 50 : 0;
  
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: targetOpacity,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: targetTranslation,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };
  
  

  const handleRentButtonPress = () => {
    setShowRentMenu(!showRentMenu);
  };

  const handleFoodButtonPress = () => {
    setShowFoodMenu(!showFoodMenu);
  };

  const handleTravelButtonPress = () => {
    setShowTravelMenu(!showTravelMenu);
  };


  return (
    <View style={styles.container}>
      <View style={styles.chatBarWrapper}>
      {showFoodMenu && <FoodMenu onPressOption={(optionIndex) => handleCategoryOptionPress('food', optionIndex)} inputText={inputText} sendMessage={sendMessage} />}
      {showRentMenu && <RentMenu onPressOption={(optionIndex) => handleCategoryOptionPress('rent', optionIndex)} inputText={inputText} sendMessage={sendMessage} />}
      {showTravelMenu && <TravelMenu onPressOption={(optionIndex) => handleCategoryOptionPress('travel', optionIndex)} inputText={inputText} sendMessage={sendMessage} />}

        <View style={[styles.chatBar, { borderTopRightRadius: showRentMenu || showFoodMenu || showTravelMenu ? 0 : 36, borderTopLeftRadius: showRentMenu || showFoodMenu || showTravelMenu ? 0 : 36 }]}>
          <TouchableOpacity onPress={toggle} style={styles.chatBarToggle}>
              <Icon name={isActive ? "remove" : "add"} size={30} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.chatBarContent}>
          {(!isActive || showRentMenu || showFoodMenu || showTravelMenu) && (
          <View style={styles.chatBarMessage}>
            <TextInput
          style={styles.chatBarInput}
          placeholder="Message..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Icon name="send" size={24} color="#FFF" />
        </TouchableOpacity>
          </View>
        )}
            <Animated.View
              style={[
                styles.chatBarButtons,
                {
                  opacity: opacityAnim,
                  transform: [{ translateY: translateAnim }],
                },
              ]}
            >
              {isActive && !showRentMenu && !showFoodMenu && !showTravelMenu && (
                <>
                  <Button icon="home" onPress={handleRentButtonPress} />
                  <Button icon="airplanemode-active" onPress={handleTravelButtonPress} />
                  <Button icon="fastfood" onPress={handleFoodButtonPress} />
                </>
              )}
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
};

const Button = ({ icon, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Icon name={icon} size={28} color="#FFF" />
  </TouchableOpacity>
);

const RentMenu = ({ onPressOption, inputText, sendMessage }) => (
  <View style={styles.menu}>
    <MenuButton text="Average monthly rent" onPress={() => {
      sendMessage(`Average monthly rent in ${inputText}`,'outgoing');
      // console.log(`Average monthly rent in ${inputText}`)
      onPressOption(0)}}/>
    <MenuButton text="Average rent in city areas" onPress={() => {
      sendMessage(`Average rent in city areas in ${inputText}`,'outgoing');
      onPressOption(1)}}/>
    <MenuButton text="Public transport" onPress={() => {
      sendMessage(`Public transport in ${inputText}`,'outgoing');
      onPressOption(2)}}/>
    <MenuButton text="Average student living cost" onPress={() => {
      sendMessage(`Average student living cost in ${inputText}`,'outgoing');      
      onPressOption(3)}}/>
    <MenuButton text="Average cost compared to other cities" onPress={() => {
      sendMessage(`Average cost compared to other cities, ${inputText}`,'outgoing');
      onPressOption(4)}}/>
  </View>
);

const FoodMenu = ({ onPressOption, inputText, sendMessage  }) => (
  <View style={styles.menu}>
    <MenuButton text="Easy to make dishes" onPress={() => {
      sendMessage("Easy to make dishes");
      onPressOption(0)}}/>
    <MenuButton text="Low budget meals" onPress={() => {
      sendMessage("Low budget meals");
      onPressOption(1)}}/>
    <MenuButton text="Food cheaper than X" onPress={() => {
      sendMessage(`Food cheaper than ${inputText}`)
      onPressOption(2)}}/>
    <MenuButton text="Week plan to save time/money" onPress={() => {
      sendMessage("Week plan to save time/money");
      onPressOption(3)}}/>
    <MenuButton text="Substitute for ingredient X" onPress={() => {
      sendMessage(`Substitute for ingredient ${inputText}`)
      onPressOption(4)}}/>
  </View>
);

const TravelMenu = ({ onPressOption, inputText, sendMessage  }) => (
  <View style={styles.menu}>
    <MenuButton text="Must visit places" onPress={() => {
      sendMessage(`Must visit places in ${inputText}`)
      onPressOption(0)}}/>
    <MenuButton text="Cost-effective traveling" onPress={() => {
      sendMessage("Cost-effective traveling");
      onPressOption(1)}}/>
    <MenuButton text="Affordable/free activities" onPress={() => {
      sendMessage(`Affordable/free activities in ${inputText}`);
      onPressOption(2)}}/>
    <MenuButton text="Perfect time to vist" onPress={() => {
      sendMessage(`Perfect time to vist ${inputText}`);
      onPressOption(3)}}/>
    <MenuButton text="Cheap cities in Europe" onPress={() => {
      sendMessage("Cheap cities in Europe");
      onPressOption(4)}}/>
  </View>
);

const MenuButton = ({ text, onPress }) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <Text style={styles.menuButtonText}>{text}</Text>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  sendButton: {
    marginLeft: 8, // Space between input and send button
    justifyContent: 'center',
    alignItems: 'center',
    width: 38, // Button size
    height: 38, // Button size
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white
    borderRadius: 18, // Rounded edges
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
    },
  chatBarWrapper: {
    position: 'relative',
  },
  chatBar: {
    backgroundColor: '#00DDA3', // Purple color for the chat bar
    borderRadius: 36,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    width: '97%', // Assuming chat bar takes 90% of container width
    zIndex: 1, // Add zIndex to keep chatBar above the menu
  },
  chatBarToggle: {
    height: 48, // Slightly larger touch area
    width: 48, // Slightly larger touch area
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12, // Space between toggle button and the rest
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 30,
  },
  chatBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatBarMessage: {
    width: '100%', // Set the width to a higher percentage value to make the input longer
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatBarInput: {
    flex: 1, // Take up all available space
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 10,
    color: '#FFF', // White color text
    fontSize: 16, // Default font size
  },
  chatBarButtons: {
    // position: 'relative',
    // left: 10, // Positioned to the right within the chat bar
    right: 10,
    flexDirection: 'row',
    height: 48, // Height to align with the toggle button
    alignItems: 'center',
  },
  button: {
    marginLeft: 8, // Space between buttons
    justifyContent: 'center',
    alignItems: 'center',
    width: 38, // Button size
    height: 38, // Button size
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white
    borderRadius: 18, // Rounded edges
  },
  menu: {
    position: 'absolute',
    // left: '5%',
    top: -235, // Adjusted to touch the chatBar
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '97%',
    paddingVertical: 8,
    backgroundColor: '#00DDA3',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    zIndex: 2, // Add zIndex to keep menu above the chatBar
  },
  menuButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 18,
    marginVertical: 4,
  },
  menuButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default ChatBar;

import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useChat } from '@/services/chatContext';
import { fetchUserDataAsString } from '@/services/userDataUtils';

const ChatBar = () => {
  const [isActive, setIsActive] = useState(false);
  const [showRentMenu, setShowRentMenu] = useState(false);
  const [showFoodMenu, setShowFoodMenu] = useState(false);
  const [showTravelMenu, setShowTravelMenu] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([
    {
      role: "system",
      content: "Your name is SaveBot, you are a friendly but professional financial advisor. Your goal is to help students save money by providing suggestions on how to budget their money. The currency is always 'RON'. You should keep your messages short (if possible), as they should look like real messages between people around the age of 20."
    }
  ]);

  useEffect(() => {
    const addSystemMessage = async () => {
      const userDataString = await fetchUserDataAsString();
      console.log(userDataString);

      setConversationHistory(prevHistory => [
        ...prevHistory,
        {
          role: "system",
          content: userDataString
        }
      ]);
    };

    addSystemMessage();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchDataAndUpdateHistory = async () => {
        const userDataString = await fetchUserDataAsString();
        console.log(userDataString);
  
        setConversationHistory(prevHistory => {
          if (prevHistory[1] && prevHistory[1].content !== userDataString) {
            return prevHistory.map((item, index) => 
              index === 1 ? { ...item, content: userDataString } : item
            );
          }
          return prevHistory;
        });
      };
  
      fetchDataAndUpdateHistory();
    }, [])
  );

  // Animated values
  const opacityAnim = useState(new Animated.Value(0))[0];
  const translateAnim = useState(new Animated.Value(50))[0];

  const { sendMessage, toggleLoading } = useChat();
  const [inputText, setInputText] = useState('');

  // Handles sending a message
  const handleSend = async () => {
    if (inputText.trim()) {
      const updatedHistory = conversationHistory.concat([{
        role: "user",
        content: inputText.trim(),
      }]);
      sendMessage(inputText);
      setInputText('');

      const url = `http://188.24.100.99:4587/default-question`;

      toggleLoading();

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            question: inputText,
            history: updatedHistory,
          }),
        });

        setInputText('');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data && data.response) {
          const newHistory = updatedHistory.concat([{
            role: "assistant",
            content: data.response,
          }]);
          setConversationHistory(newHistory);
          sendMessage(data.response, 'incoming');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch response from the server.');
        console.error(error);
      } finally {
        // toggleLoading();
      }
    }
  };

  // Handles pressing category options
  const handleCategoryOptionPress = async (category, optionIndex) => {
    const userInput = inputText;
    let url = `http://188.24.100.99:4587`;
    const optionsRequiringInput = {
      food: [2, 4],
      rent: [0, 1, 2, 3, 4],
      travel: [0, 2, 3]
    };

    if (optionsRequiringInput[category].includes(optionIndex) && !userInput.trim()) {
      Alert.alert("Input Needed", "Please provide input for this question.");
      return;
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

    toggleLoading();

    try {
      setInputText('');
      setIsActive(!isActive);
      setShowFoodMenu(false);
      setShowRentMenu(false);
      setShowTravelMenu(false);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput,
          history: conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data && data.response) {
        setConversationHistory(data.history);
        sendMessage(data.response, 'incoming');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch response from the server.');
      console.error(error);
    }
  };

  // Toggles the chat bar and menus
  const toggle = () => {
    const anyMenuOpen = showRentMenu || showFoodMenu || showTravelMenu;

    if (anyMenuOpen) {
      setShowRentMenu(false);
      setShowFoodMenu(false);
      setShowTravelMenu(false);
      if (!isActive) {
        setIsActive(true);
      }
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

  const handleRentButtonPress = () => setShowRentMenu(!showRentMenu);
  const handleFoodButtonPress = () => setShowFoodMenu(!showFoodMenu);
  const handleTravelButtonPress = () => setShowTravelMenu(!showTravelMenu);

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
      inputText && sendMessage(`Average monthly rent in ${inputText}`,'outgoing');
      onPressOption(0);
    }}/>
    <MenuButton text="Average rent in city areas" onPress={() => {
      inputText && sendMessage(`Average rent in city areas in ${inputText}`,'outgoing');
      onPressOption(1);
    }}/>
    <MenuButton text="Public transport" onPress={() => {
      inputText && sendMessage(`Public transport in ${inputText}`,'outgoing');
      onPressOption(2);
    }}/>
    <MenuButton text="Average student living cost" onPress={() => {
      inputText && sendMessage(`Average student living cost in ${inputText}`,'outgoing');      
      onPressOption(3);
    }}/>
    <MenuButton text="Average cost compared to other cities" onPress={() => {
      inputText && sendMessage(`Average cost compared to other cities, ${inputText}`,'outgoing');
      onPressOption(4);
    }}/>
  </View>
);

const FoodMenu = ({ onPressOption, inputText, sendMessage }) => (
  <View style={styles.menu}>
    <MenuButton text="Easy to make dishes" onPress={() => {
      sendMessage("Easy to make dishes");
      onPressOption(0);
    }}/>
    <MenuButton text="Low budget meals" onPress={() => {
      sendMessage("Low budget meals");
      onPressOption(1);
    }}/>
    <MenuButton text="Food cheaper than X" onPress={() => {
      inputText && sendMessage(`Food cheaper than ${inputText}`);
      onPressOption(2);
    }}/>
    <MenuButton text="Week plan to save time/money" onPress={() => {
      sendMessage("Week plan to save time/money");
      onPressOption(3);
    }}/>
    <MenuButton text="Substitute for ingredient X" onPress={() => {
      inputText && sendMessage(`Substitute for ingredient ${inputText}`);
      onPressOption(4);
    }}/>
  </View>
);

const TravelMenu = ({ onPressOption, inputText, sendMessage }) => (
  <View style={styles.menu}>
    <MenuButton text="Must visit places" onPress={() => {
      inputText && sendMessage(`Must visit places in ${inputText}`);
      onPressOption(0);
    }}/>
    <MenuButton text="Cost-effective traveling" onPress={() => {
      sendMessage("Cost-effective traveling");
      onPressOption(1);
    }}/>
    <MenuButton text="Affordable/free activities" onPress={() => {
      inputText && sendMessage(`Affordable/free activities in ${inputText}`);
      onPressOption(2);
    }}/>
    <MenuButton text="Perfect time to visit" onPress={() => {
      inputText && sendMessage(`Perfect time to visit ${inputText}`);
      onPressOption(3);
    }}/>
    <MenuButton text="Cheap cities in Europe" onPress={() => {
      sendMessage("Cheap cities in Europe");
      onPressOption(4);
    }}/>
  </View>
);

const MenuButton = ({ text, onPress }) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <Text style={styles.menuButtonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  sendButton: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 38,
    height: 38,
    backgroundColor: '#6AD4DD',
    borderRadius: 18,
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
    backgroundColor: '#1e1f22',
    borderRadius: 36,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    zIndex: 1,
  },
  chatBarToggle: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 30,
  },
  chatBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatBarMessage: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatBarInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 10,
    color: '#FFF',
    fontSize: 16,
  },
  chatBarButtons: {
    right: 10,
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
  },
  button: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 18,
  },
  menu: {
    position: 'absolute',
    top: -230,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
    backgroundColor: '#1e1f22',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    zIndex: 2,
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
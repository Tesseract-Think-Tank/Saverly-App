import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ChatBar = () => {
  const [isActive, setIsActive] = useState(false);
  const [showRentMenu, setShowRentMenu] = useState(false);
  const [showFoodMenu, setShowFoodMenu] = useState(false);
  const [showTravelMenu, setShowTravelMenu] = useState(false);

  // Animated values
  const opacityAnim = useState(new Animated.Value(0))[0]; // Initial opacity is 0 to hide the buttons
  const translateAnim = useState(new Animated.Value(50))[0]; // Start with buttons translated down

  // Toggle function to animate buttons in and out
  const toggle = () => {
    setIsActive(!isActive);

    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: isActive ? 0 : 1, // Fade in if isActive will be true, fade out otherwise
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: isActive ? 50 : 0, // Move up if isActive will be true, move down otherwise
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
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
        {showRentMenu && <RentMenu />}
        {showFoodMenu && <FoodMenu />}
        {showTravelMenu && <TravelMenu />}
        <View style={[styles.chatBar, { borderTopRightRadius: showRentMenu || showFoodMenu || showTravelMenu ? 0 : 36, borderTopLeftRadius: showRentMenu || showFoodMenu || showTravelMenu ? 0 : 36 }]}>
          <TouchableOpacity onPress={toggle} style={styles.chatBarToggle}>
            <Icon name="add" size={30} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.chatBarContent}>
            {!isActive && (
              <View style={styles.chatBarMessage}>
                <TextInput
                  style={styles.chatBarInput}
                  placeholder="Message..."
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                />
                <TouchableOpacity style={styles.sendButton}>
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
            ]}>
            <Button icon="home" onPress={handleRentButtonPress} />
            <Button icon="airplanemode-active" onPress={handleTravelButtonPress} />
            <Button icon="fastfood" onPress={handleFoodButtonPress} />
            {/* <Button icon="more-horiz" /> */}
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

const RentMenu = () => (
  <View style={styles.menu}>
    <MenuButton text="Rent Button 1" />
    <MenuButton text="Rent Button 2" />
    <MenuButton text="Rent Button 3" />
    <MenuButton text="Rent Button 4" />
    <MenuButton text="Rent Button 5" />
  </View>
);

const FoodMenu = () => (
  <View style={styles.menu}>
    <MenuButton text="Food Button 1" />
    <MenuButton text="Food Button 2" />
    <MenuButton text="Food Button 3" />
    <MenuButton text="Food Button 4" />
    <MenuButton text="Food Button 5" />
  </View>
);

const TravelMenu = () => (
  <View style={styles.menu}>
    <MenuButton text="Travel Button 1" />
    <MenuButton text="Travel Button 2" />
    <MenuButton text="Travel Button 3" />
    <MenuButton text="Travel Button 4" />
    <MenuButton text="Travel Button 5" />
  </View>
);

const MenuButton = ({ text }) => (
  <TouchableOpacity style={styles.menuButton}>
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
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Example background color
  },
  chatBarWrapper: {
    position: 'relative',
  },
  chatBar: {
    backgroundColor: '#714efc', // Purple color for the chat bar
    borderRadius: 36,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    width: '90%', // Assuming chat bar takes 90% of container width
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
    position: 'relative',
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
    top: -236, // Adjusted to touch the chatBar
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '90%',
    paddingVertical: 8,
    backgroundColor: '#714efc',
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

import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ChatBar = () => {
    const [isActive, setIsActive] = useState(false);
  
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
  
    return (
      <View style={styles.container}>
        <View style={styles.chatBar}>
          <TouchableOpacity onPress={toggle} style={styles.chatBarToggle}>
            <Icon name="add" size={30} color="#FFF" />
          </TouchableOpacity>
          {!isActive && (
            <View style={styles.chatBarMessage}>
              <TextInput
                style={styles.chatBarInput}
                placeholder="Message..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
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
            <Button icon="camera-alt" />
            <Button icon="photo" />
            <Button icon="gif" />
            <Button icon="more-horiz" />
          </Animated.View>
        </View>
      </View>
    );
  };
  
const Button = ({ icon }) => (
  <TouchableOpacity style={styles.button}>
    <Icon name={icon} size={28} color="#FFF" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Example background color
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
  chatBarMessage: {
    flex: 1, // Take up all available space
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
    position: 'absolute',
    right: 10, // Positioned to the right within the chat bar
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
});

export default ChatBar;

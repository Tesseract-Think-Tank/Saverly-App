import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableOpacity, Platform, ImageBackground } from 'react-native';
import ChatBar from '@/components/ChatBar'; // Ensure this path is correct
import { useNavigation } from '@react-navigation/native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import AnimatedLoader from "react-native-animated-loader";
import { ChatProvider, useChat } from '../../services/chatContext'; // Adjust the import path as needed
import { TypingAnimation } from 'react-native-typing-animation';
import { router } from 'expo-router';
import backgroundStyles from "@/services/background";


// We'll create a new component that consumes the context
const ChatContent: React.FC = () => {
  const { messages, isLoading } = useChat();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
  }, [navigation]);
  

  return (
    <View style={backgroundStyles.containerWithBGColor}>
        <ImageBackground
        source={require('@/assets/backgroundWoodPattern.png')}
        style={backgroundStyles.background}>
        <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('Home')} style={styles.button}>
          <AntDesign name="left" size={24} color="#6AD4DD" />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>S</Text>
          </View>
          <Text style={styles.name}>SaveBot</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.middle}>
          {messages.map((message) => (
            <View style={[styles.bubble, message.type === 'incoming' ? styles.incomingBubble : styles.outgoingBubble]} key={message.id}>
              <Text style={styles.bubbleText}>{message.text}</Text>
            </View>
          ))}
        {isLoading && (
          <View style={styles.bubble}>
              <TypingAnimation 
                dotColor="white"
                dotMargin={3}
                dotAmplitude={10}
                dotSpeed={0.15}
                dotRadius={5}
                dotX={12}
                dotY={6}
              />
          </View>
        )} 
        </View>
      </ScrollView>
      <View style={styles.chatBarContainer}>
        <ChatBar />
      </View>
    </KeyboardAvoidingView>
    </ImageBackground>
    </View>
  );
};

// ChatBox component that simply wraps ChatContent with ChatProvider
const ChatBox: React.FC = () => {
  return (
    <ChatProvider>
      <ChatContent />
    </ChatProvider>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#2B2D31',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-end', // This makes sure your input bar stays at the bottom
    paddingBottom: 125
  },
  maskingView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 110, // Height of the area to "hide", adjust as needed
    backgroundColor: '#fff', // Adjust color or make transparent as per your design
  },
  topBar: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 25,
    backgroundColor: '#1e1f22',
    // borderBottomWidth: 1,
    borderBottomColor: '#000',
 // Adjust this value to lower the top bar
  },
  
  avatarContainer: {
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingRight: 10,
      top:10,
  },

  avatar: {
    width: 35,
    height: 35,
    backgroundColor: '#fff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#000',
  },
  name: {
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#fff'
  },

  lottie: {
    width: 100,
    height: 100
  },

  chatBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#2B2D31',
    padding: 10,
    bottom: 0
  },
  middle: {
    padding: 20,
  },
  incoming: {
    marginBottom: 20,
  },
  outgoing: {
    marginBottom: 20,
  },
  bubble: {
    padding: 10,
    borderRadius: 20,
    marginBottom: 5,
  },
  bubbleText: {
    fontSize: 15,
  },
  incomingBubble: {
    backgroundColor: '#ccc',
    alignSelf: 'flex-start',
    // width: '80%',
    maxWidth: '80%'
  },
  outgoingBubble: {
    flex: 1,
    backgroundColor: '#6AD4DD',
    alignSelf: 'flex-end',
    // width: '70%',
    maxWidth: '80%'
  },
  lower: {
    marginTop: 15,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top:10,
  },
  
  // Update your button style to remove the margins and adjust padding if necessary
  button: {
    position: 'absolute',
    top:30,
    left:20,
    padding: 10,
    borderRadius: 5,
    zIndex:1,
  },
});

export default ChatBox;
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableOpacity, Platform } from 'react-native';
import ChatBar from '@/components/ChatBar'; // Ensure this path is correct
import { useNavigation } from '@react-navigation/native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { ChatProvider, useChat } from '../../services/chatContext'; // Adjust the import path as needed

// We'll create a new component that consumes the context
const ChatContent: React.FC = () => {
  const { messages } = useChat();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
          <AntDesign name="left" size={24} color="black" />
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
        </View>
      </ScrollView>
      <View style={styles.chatBarContainer}>
        <ChatBar />
      </View>
    </KeyboardAvoidingView>
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
    backgroundColor: '#33404F',
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
    padding: 15,
    backgroundColor: '#00DDA3',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginTop: 25, // Adjust this value to lower the top bar
  },
  
  avatarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      paddingRight: 55
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
    color: '#',
  },
  name: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  chatBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#33404F',
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
    fontSize: 14,
  },
  incomingBubble: {
    backgroundColor: '#ccc',
    alignSelf: 'flex-start',
    width: '80%'
  },
  outgoingBubble: {
    // backgroundColor: '#3f51b5',
    backgroundColor: '#00DDA3',
    alignSelf: 'flex-end',
    width: '70%'
  },
  lower: {
    marginTop: 15,
  },
  buttonContainer: {
    // padding: 12, // Increase the touchable area by adding padding
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Update your button style to remove the margins and adjust padding if necessary
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50
    // Ensure the button itself does not grow larger, only its touchable area does
  },
});

export default ChatBox;
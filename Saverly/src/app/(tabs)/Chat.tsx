import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import ChatBar from '@/components/ChatBar'; // Make sure this path is correct
import { useNavigation } from '@react-navigation/native';

const ChatBox = () => {
  const navigation = useNavigation();
  const [chatBarPosition, setChatBarPosition] = useState(75);
  const [bottomPadding, setBottomPadding] = useState(125);
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
      setChatBarPosition(0);
      setBottomPadding(145);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
      setChatBarPosition(75);
      setBottomPadding(125);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [navigation]);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
      <View style={styles.topBar}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>S</Text>
        </View>
        <Text style={styles.name}>SaveBot</Text>
      </View>
      <ScrollView 
        style={styles.scrollView} 
        // contentContainerStyle={[styles.scrollViewContent, { bottom: bottomPadding }]}>
        contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.middle}>
          <View style={styles.incoming}>
            <View style={[styles.bubble, styles.incomingBubble]}>
              <Text style={styles.bubbleText}>
                👋 Hello there! I'm SaveBot, your personal financial assistant here at Saverly. I'm dedicated to helping you make smarter financial decisions, find better ways to save, and ultimately reach your financial goals. Whether you're looking to save for a rainy day, pay off debt, or plan for a big purchase, I'm here to guide and support you every step of the way.
              </Text>
            </View>

            <View style={[styles.bubble, styles.incomingBubble]}>
              <Text style={styles.bubbleText}>
                👋 Hello there! I'm SaveBot, your personal financial assistant here at Saverly. I'm dedicated to helping you make smarter financial decisions, find better ways to save, and ultimately reach your financial goals. Whether you're looking to save for a rainy day, pay off debt, or plan for a big purchase, I'm here to guide and support you every step of the way.
              </Text>
            </View>

            <View style={[styles.bubble, styles.incomingBubble]}>
              <Text style={styles.bubbleText}>
                👋 Hello there! I'm SaveBot, your personal financial assistant here at Saverly. I'm dedicated to helping you make smarter financial decisions, find better ways to save, and ultimately reach your financial goals. Whether you're looking to save for a rainy day, pay off debt, or plan for a big purchase, I'm here to guide and support you every step of the way.
              </Text>
            </View>
            
          </View>
          <View style={styles.outgoing}>
            <View style={[styles.bubble, styles.outgoingBubble]}>
              <Text style={styles.bubbleText}>Nah, it's cool.</Text>
            </View>
            
            <View style={[styles.bubble, styles.outgoingBubble, styles.lower]}>
              <Text style={styles.bubbleText}>Well you should get your Dad a cologne. Here smell it. Oh wait! ...</Text>
            </View>
          </View>
        </View>
        </ScrollView>
      <View style={styles.maskingView}></View>
      <View style={[styles.chatBarContainer, { bottom: chatBarPosition }]}>
        <ChatBar />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    marginTop: 25, // Adjust this value to lower the top bar
  },
  
  avatar: {
    width: 35,
    height: 35,
    backgroundColor: '#3f51b5',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
  },
  name: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  chatBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 10,
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
    backgroundColor: '#6C63FF',
    alignSelf: 'flex-end',
    width: '70%'
  },
  lower: {
    marginTop: 15,
  },
});

export default ChatBox;
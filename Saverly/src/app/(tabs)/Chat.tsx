import ChatBar from '@/components/ChatBar';
import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';

const ChatBox = () => {
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={100}>
    <View style={styles.chatContainer}>
        <View style={styles.topBar}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>S</Text>
          </View>
          <Text style={styles.name}>SaveBot</Text>
        </View>
        <View style={styles.middle}>
          <View style={styles.incoming}>
            <View style={[styles.bubble, styles.incomingBubble]}>
              <Text style={styles.bubbleText}>👋 Hello there! I'm SaveBot, your personal financial assistant here at Saverly. I'm dedicated to helping you make smarter financial decisions, find better ways to save, and ultimately reach your financial goals. Whether you're looking to save for a rainy day, pay off debt, or plan for a big purchase, I'm here to guide and support you every step of the way.</Text>
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
      </View>
      <ChatBar></ChatBar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatContainer: {
    position: 'relative',
    marginTop: '12%',
    width: 620,
    height: 450,
  },
  avatar: {
    width: 35,
    height: 35,
    backgroundColor: '#3f51b5',
    borderRadius: 50,
    position: 'absolute',
    top: 11,
    left: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
  },
  name: {
    position: 'absolute',
    top: 22,
    textTransform: 'uppercase',
    color: '#000',
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: '500',
    left: 60,
  },
  chatbox: {
    position: 'absolute',
    left: '35%',
    height: '75%',
    width: '60%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  topBar: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  middle: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '100%',
    opacity: 0.85,
    top: 60,
    height: '80%',
  },
  incoming: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    padding: 20,
  },
  bubble: {
    position: 'relative',
    marginBottom: 5,
    color: '#fff',
    fontSize: 14,
    padding: 10,
    borderRadius: 20,
  },
  bubbleText: {
    color: '#fff',
  },
  incomingBubble: {
    backgroundColor: '#ccc',
  },
  outgoing: {
    position: 'absolute',
    padding: 20,
    marginTop: 150,
    left:100,
    right: 0,
    top: '15%',
    width: '50%',
    height: '100%',
  },
  outgoingBubble: {
    backgroundColor: '#3f51b5',
    alignSelf: 'flex-end',
  },
  lower: {
    marginTop: 45,
  },
});

export default ChatBox;
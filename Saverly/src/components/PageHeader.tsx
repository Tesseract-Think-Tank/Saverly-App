import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  title: string;
};

const PageHeader: React.FC<Props> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop:45,
    backgroundColor: '#00DDA3',
    paddingVertical: 16,
    paddingHorizontal: 24,
    elevation: 4, // For Android
    shadowColor: '#000', // For iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default PageHeader;

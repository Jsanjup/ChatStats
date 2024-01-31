import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

const NeumorphicButton = ({
  onPress,
  text,
}: {
  text: string;
  onPress?: (event: GestureResponderEvent) => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#a0f0a0', // Light background color
    borderRadius: 10,
    padding: 15,
    margin: 10,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#53a353', // Shadow color
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#4a4a4a', // Text color
  },
});

export default NeumorphicButton;

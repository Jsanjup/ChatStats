import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import NeumorphicButton from './ButtonNeumorphic';

type formProps = {
  title: string;
  description?: string;

  handleInput?: (t: string) => void;

  buttonText?: string;
  handleSubmit?: () => void;
};

const SimpleForm = (props: formProps) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      {props.description && (
        <Text style={styles.description}>{props.description}</Text>
      )}

      {props.handleInput && (
        <TextInput
          style={styles.input}
          placeholder="Opcional"
          value={inputValue}
          onChangeText={text => setInputValue(text)}
        />
      )}

      {props.buttonText && (
        <NeumorphicButton
          text={props.buttonText}
          onPress={props.handleSubmit}></NeumorphicButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#3498db',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SimpleForm;

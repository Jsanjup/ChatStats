/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {Dimensions, StyleSheet, useColorScheme} from 'react-native';

const isDarkMode = useColorScheme() === 'dark';
const {width, height} = Dimensions.get('window');
const margin = 20;

const darkStyles = StyleSheet.create({
  backgroundStyle: {backgroundColor: ''},
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  pressed: {
    backgroundColor: '#DEEEEA',
    borderRadius: 20,
    shadowRadius: 10,
    width: width - 2 * margin,
  },
});

const lightStyles = StyleSheet.create({
  backgroundStyle: {},
});

export const styles = isDarkMode ? darkStyles : lightStyles;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  Dimensions,
  ImageStyle,
  StyleSheet,
  TextStyle,
  ViewStyle,
  useColorScheme,
} from 'react-native';

const isDarkMode = useColorScheme() === 'dark';
const {width, height} = Dimensions.get('window');
const margin = 20;

type NamedStyles<T> = {[P in keyof T]: ViewStyle | TextStyle | ImageStyle};

const commonStyle: NamedStyles<any> = {
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 40,
    marginBottom: 10,
    color: 'black',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: 200,
    alignItems: 'center',
  },
};

const darkStyles = StyleSheet.create({
  title: commonStyle.title,
  container: commonStyle.container,
  buttonContainer: commonStyle.buttonContainer,
  button: commonStyle.button,
  backgroundStyle: {
    backgroundColor: '#101a10',
    color: '#d0f0d0',
  },
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
  title: commonStyle.title,
  container: commonStyle.container,
  buttonContainer: commonStyle.buttonContainer,
  button: commonStyle.button,
  backgroundStyle: {
    backgroundColor: '#d0f0d0',
    color: '#208020',
  },
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

export const styles = isDarkMode ? darkStyles : lightStyles;

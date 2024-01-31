/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {stats} from './App/Model/Stat';
import ChatDetails from './App/Screens/ChatDetails';
import ChatList from './App/Screens/ChatList';
import {setI18nConfig} from './App/util/Internationalization';

export type chatProps = {
  data: stats;
  beginDate?: moment.Moment;
  endDate?: moment.Moment;
};

export type navigableState = {
  loading: boolean;
};

export type StackParamList = {
  ChatList: undefined;
  ChatDetails: chatProps | undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

function MyStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="ChatDetails" component={ChatDetails} />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    setI18nConfig();

    // LogBox.ignoreAllLogs();
    // LogBox.ignoreLogs(['']);

    // SplashScreen.hide();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

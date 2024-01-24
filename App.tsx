/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {stats} from './App/Model/Stat';
import ChatList from './App/Screens/ChatList';
import {Graph} from './App/Screens/Graph';
import TableComponent from './App/Screens/Table';

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
  ChatTable: chatProps;
  ChatGraph: chatProps;
};

const Stack = createNativeStackNavigator<StackParamList>();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="ChatTable" component={TableComponent} />
      <Stack.Screen name="ChatGraph" component={Graph} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

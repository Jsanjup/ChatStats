/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Dispatch} from '@reduxjs/toolkit';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {StackParamList} from '../../App';
import {chatsSelectors} from '../features/Chats';
import {checkLocalChats} from '../features/Chats/actions';
import {ChatActions} from '../features/Chats/types';
import {chat} from '../Model/Chat';
import translate from '../util/Internationalization';
import NeumorphicButton from './Components/ButtonNeumorphic';
import {styles} from './Styles/ChatListStyles';

type Props = NativeStackScreenProps<StackParamList, 'ChatList'>;

function ChatList(props: Props): JSX.Element {
  const dispatch = useDispatch<Dispatch<ChatActions>>();
  const chats = useSelector(chatsSelectors.getChats);

  useEffect(() => {
    dispatch(checkLocalChats());
  }, []);

  const renderElement = (text: string, onPress: () => void) => (
    <NeumorphicButton
      key={text}
      text={text}
      onPress={onPress}></NeumorphicButton>
  );

  return (
    <View style={[styles.container, styles.backgroundStyle]}>
      <NeumorphicButton text="Chats analizados"></NeumorphicButton>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.backgroundStyle}
        contentContainerStyle={styles.buttonContainer}>
        {renderElement(translate('NEW_CHAT'), () => {
          props.navigation.navigate('ChatDetails');
        })}
        {chats?.map((chat: chat) =>
          renderElement(chat.id, () =>
            props.navigation.navigate('ChatDetails', {data: chat.stats}),
          ),
        )}
      </ScrollView>
    </View>
  );
}

export default ChatList;

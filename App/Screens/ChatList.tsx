/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {StackParamList} from '../../App';
import {chat} from '../Model/Chat';
import {DB} from '../Service/DB';
import translate from '../util/Internationalization';
import NeumorphicButton from './Components/ButtonNeumorphic';
import {styles} from './Styles/ChatListStyles';

type Props = NativeStackScreenProps<StackParamList, 'ChatList'>;

function ChatList(props: Props): JSX.Element {
  const [chats, setChats] = useState<chat[] | undefined>();

  const loadChats = useCallback(async () => {
    let dbchats = chats;
    try {
      dbchats = await DB.getAllChats();
    } catch (e) {
      console.error('[ChatList]', 'Error retrieving all chats', e);
    }
    console.log(dbchats);
    setChats(dbchats);
  }, []);

  useEffect(() => {
    loadChats();
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

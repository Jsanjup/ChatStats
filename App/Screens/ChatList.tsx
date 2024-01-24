/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text} from 'react-native';

export type SharedItem = {
  mimeType: string;
  data: string;
  extraData: any;
};

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {NeomorphFlex} from 'react-native-neomorph-shadows';
import ShareMenu from 'react-native-share-menu';
import {StackParamList} from '../../App';
import {stats} from '../Model/Stat';
import {ChatAnalyzer} from '../Service/ChatAnalyzer';
import {ChatProcessor} from '../Service/ChatProcessor';
import {Regex} from '../util/Regex';
import {styles} from './Styles/ChatListStyles';

type Props = NativeStackScreenProps<StackParamList, 'ChatList'>;

function ChatList(props: Props): JSX.Element {
  const [stats, setStats] = useState<stats | undefined>();
  const [chat, setSelectedChat] = useState('');

  const handleShare = useCallback(async (item?: SharedItem) => {
    if (!item) {
      return;
    }
    try {
      const {id, lines} = await ChatProcessor.process(item);
      console.debug(
        'ChatList',
        'Lines processed for chat id',
        id,
        lines.length,
      );
      const filter2 = Regex.buildSimilar('birra', [
        'bier',
        'beer',
        'bière',
        'beerra',
        'birts',
      ]);
      // console.debug('ChatList', 'Regex computed for word', 'birra', filter2);

      const filter = Regex.buildSimilar('lavadora');
      // console.debug('ChatList', 'Regex computed for word', 'lavadora', filter);
      ChatAnalyzer.setFilter(filter2);
      const stats = ChatAnalyzer.analyze(id, lines);
      console.log('ChatList', 'Got stats');
      props.navigation.navigate('ChatTable', {data: stats});
    } catch (err) {
      console.warn('Error analyizing or processing lines', err);
    }
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, []);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);

    return () => {
      listener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.backgroundStyle}>
        <TouchableOpacity onPress={() => console.log('pressed')}>
          <NeomorphFlex
            inner // <- enable shadow inside of neomorph
            swapShadows // <- change zIndex of each shadow color
            style={{
              shadowRadius: 10,
              borderRadius: 25,
              backgroundColor: '#DDDDDD',
              width: 150,
              height: 150,
            }}>
            <Text>+</Text>
          </NeomorphFlex>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ChatList;

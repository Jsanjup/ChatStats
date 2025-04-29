/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, Switch, Text} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import moment from 'moment';
import ShareMenu from 'react-native-share-menu';
import {StackParamList, chatProps} from '../../App';
import {stats} from '../Model/Stat';
import {ChatManager, SharedItem} from '../Service/ChatManager';
import translate from '../util/Internationalization';
import {Time} from '../util/Time';
import SimpleForm from './Components/Form';
import {Graph} from './Components/Graph';
import TableComponent from './Components/Table';
import {styles} from './Styles/ChatListStyles';

type Props = NativeStackScreenProps<StackParamList, 'ChatDetails'>;

type emptyChatProps = {
  setStats: (stats: stats | undefined) => void;
};

function EmptyChatDetails(props: emptyChatProps): JSX.Element {
  const [chatData, setChatData] = useState<SharedItem | undefined>();
  const [filter, setFilter] = useState<string | undefined>();
  const [filterWords, setFilterWords] = useState<string[] | undefined>();

  const handleShare = useCallback(async (item?: SharedItem) => {
    console.log('HANDLED DATA', item);
    setChatData(item);
    console.log('chatData', chatData);
  }, []);

  const analyze = useCallback(async () => {
    console.log('Analyzing...');
    const chat = await ChatManager.createChat(chatData, filter, filterWords);
    console.log('Set Stats');
    props.setStats(chat.stats);
  }, [chatData]);

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
    <SafeAreaView style={[styles.backgroundStyle, styles.container]}>
      {chatData ? (
        <>
          <SimpleForm
            title={'Datos cargados'}
            description={
              'Hemos importado los datos de whatsapp. Introduce una palabra de filtro si quieres usarla como métrica de actividad.'
            }
            buttonText="Analizar"
            handleInput={e => setFilter(e)}
            handleSubmit={() => analyze()}></SimpleForm>
        </>
      ) : (
        <>
          <Text>{translate('NO_CHAT_DATA')}</Text>
          <Text>{translate('SELECT_WHATSAPP_CHAT')}</Text>
        </>
      )}
    </SafeAreaView>
  );
}

function ChatStatsDetails(props: chatProps): JSX.Element {
  const [beginDate, setBeginDate] = useState<moment.Moment | undefined>(
    props.beginDate,
  );
  const [endDate, setEndDate] = useState<moment.Moment | undefined>(
    props.endDate,
  );

  const [view, setView] = useState<'table' | 'graph'>('table');

  useEffect(() => {
    const [beginDate, endDate] = Time.getMonthWindow();
    setBeginDate(beginDate);
    setEndDate(endDate);
  }, []);

  console.log('Detail view', beginDate, endDate, view);

  return (
    <SafeAreaView style={[styles.container, styles.backgroundStyle]}>
      <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={view === 'table' ? '#f5dd4b' : '#f4f3f4'}
        onValueChange={() =>
          view === 'table' ? setView('graph') : setView('table')
        }
        value={view === 'graph'}
      />
      {view === 'table' ? (
        <TableComponent
          data={props.data}
          beginDate={beginDate}
          endDate={endDate}></TableComponent>
      ) : (
        <Graph
          data={props.data}
          beginDate={beginDate}
          endDate={endDate}></Graph>
      )}
    </SafeAreaView>
  );
}

function ChatDetails(props: Props): JSX.Element {
  const [stats, setStats] = useState<stats | undefined>(
    props.route.params?.data,
  );

  const loadStats = useCallback(
    (stats: stats | undefined) => {
      setStats(stats);
    },
    [stats],
  );

  console.log('[Chat Details reload]', 'Stats', stats);

  return stats ? (
    <ChatStatsDetails data={stats}></ChatStatsDetails>
  ) : (
    <EmptyChatDetails setStats={loadStats}></EmptyChatDetails>
  );
}

export default ChatDetails;

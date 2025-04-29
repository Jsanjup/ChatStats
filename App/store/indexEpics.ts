import {Epic, combineEpics} from 'redux-observable';
import {chatsEpics} from '../features/Chats';
import {ChatActions} from '../features/Chats/types';
import {RootState} from './indexReducers';

export type allActions = ChatActions;

export const rootEpic = combineEpics<allActions, any, RootState, any>(
  chatsEpics.checkLocalChatEpic as Epic<allActions, any, RootState>,
);

import {chat} from '../../Model/Chat';
import {ChatActions, ChatActionTypes} from './types';

export const checkLocalChats = (): ChatActions => {
  console.log('ACTION => CHECK_LOCAL_CHATS');
  return {
    type: ChatActionTypes.CHECK_LOCAL_CHATS,
  };
};

export const setLocalChats = (chats: chat[]): ChatActions => {
  console.log('ACTION => SET_LOCAL_CHATS');
  return {
    type: ChatActionTypes.SET_LOCAL_CHATS,
    chats: chats,
  };
};

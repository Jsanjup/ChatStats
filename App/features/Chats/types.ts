import {chat} from '../../Model/Chat';

interface checkLocalChats {
  type: ChatActionTypes.CHECK_LOCAL_CHATS;
}

interface setLocalChats {
  type: ChatActionTypes.SET_LOCAL_CHATS;
  chats: chat[];
}

export enum ChatActionTypes {
  CHECK_LOCAL_CHATS = 'chats/check',
  SET_LOCAL_CHATS = 'chats/set',
}

export type ChatActions = checkLocalChats | setLocalChats;

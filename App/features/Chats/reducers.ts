import {chat} from '../../Model/Chat';
import {ChatActionTypes} from './types';

export interface ChatsState {
  Chats?: chat[];
}

const initialState: ChatsState = {};

const ChatsState = (
  state = initialState,
  action: NotificationActions,
): ChatsState => {
  switch (action.type) {
    case ChatActionTypes.CHECK_LOCAL_CHATS:
      return {
        ...state,
      };
    case ChatActionTypes.SET_LOCAL_CHATS:
      return {
        ...state,
        Chats: [...action.chats],
      };
    default:
      return state;
  }
};

export default ChatsState;

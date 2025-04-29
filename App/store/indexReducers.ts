import {combineReducers} from 'redux';
import {chatsState} from '../features/Chats';

const rootState = {
  chatsState,
};

const rootReducer = combineReducers(rootState);

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

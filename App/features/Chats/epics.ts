import {Epic, ofType} from 'redux-observable';
import {from, of} from 'rxjs';
import {catchError, mergeMap, switchMap} from 'rxjs/operators';
import {chat} from '../../Model/Chat';
import {DB} from '../../Service/DB';
import {RootState} from '../../Store/indexReducers';
import {setLocalChats} from './actions';
import {ChatActions, ChatActionTypes} from './types';

export const checkLocalChatEpic: Epic<ChatActions, any, RootState> = (
  action$: any,
  state$: any,
): any => {
  return action$.pipe(
    ofType(ChatActionTypes.CHECK_LOCAL_CHATS),
    switchMap((action: any): any => {
      console.log('[CHAT EPICS] ', action);
      return from(DB.getAllChats()).pipe(
        //storeChat
        mergeMap((chats: chat[]) => {
          console.log('[CHAT EPICS]', 'ChatConnector - Chats: ', chats);
          return of(setLocalChats(chats));
        }),
        catchError((error: Error) => {
          console.log(error);
          return of();
        }),
      );
    }),
  );
};

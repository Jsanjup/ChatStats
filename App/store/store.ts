import {configureStore, Store} from '@reduxjs/toolkit';
import {createEpicMiddleware} from 'redux-observable';
import {allActions, rootEpic} from './indexEpics';
import rootReducer, {RootState} from './indexReducers';

const epicMiddleware = createEpicMiddleware<allActions, any, RootState, any>();
let store: Store<any> | null = null;

export function dispatch(action: any) {
  return store?.dispatch(action);
}

export function getAppState(): RootState {
  return store?.getState();
}

export default function getStore() {
  if (store == null) {
    store = configureStore({
      reducer: rootReducer,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(epicMiddleware),
    });
    epicMiddleware.run(rootEpic);
  }
  return store;
}

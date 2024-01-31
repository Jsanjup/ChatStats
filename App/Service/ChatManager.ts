import moment from 'moment';
import {chat} from '../Model/Chat';
import {Regex} from '../util/Regex';
import {ChatAnalyzer} from './ChatAnalyzer';
import {ChatProcessor} from './ChatProcessor';
import {DB} from './DB';

export type SharedItem = {
  mimeType: string;
  data: string;
  extraData: any;
};

export class ChatManager {
  static async createChat(
    item?: SharedItem,
    filter?: string,
    filterAdd?: string[],
  ): Promise<chat> {
    if (!item) {
      throw new Error('Need chat export to create chat');
    }
    try {
      const {id, lines} = await ChatProcessor.process(item);
      console.debug(
        'ChatList',
        'Lines processed for chat id',
        id,
        lines.length,
      );
      if (filter) {
        const filterRegex = Regex.buildSimilar(filter, filterAdd);
        ChatAnalyzer.setFilter(filterRegex);
      }
      const stats = ChatAnalyzer.analyze(id, lines);
      console.log('[ChatList]', 'Got stats');

      const chat: chat = {
        id: id,
        lastDate: moment(),
        stats: stats,
        additionalFilters: filterAdd,
        wordfilter: filter,
      };

      await DB.createNewChat(chat);
      return chat;
    } catch (err) {
      console.warn('Error analyizing or processing lines', err);
      throw err;
    }
  }

  static async analyzeToExistingChat(
    chat: chat,
    item: SharedItem,
    filter?: string,
    filterAdd?: string[],
  ): Promise<chat> {
    throw new Error('Not implemented');
  }
}

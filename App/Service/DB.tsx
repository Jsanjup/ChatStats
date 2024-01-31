import {typeORMDriver} from 'react-native-quick-sqlite';
import {
  CustomRepositoryNotFoundError,
  DataSource,
  Repository,
} from 'typeorm/browser';
import {Chat, chat} from '../Model/Chat';
import {Stats} from '../Model/Stat';

const DB_NAME = 'chatstats.db';
const CONNECTION_NAME = 'chatstats';

export class DB {
  static chatRepository: Repository<Chat>;
  static statsRepository: Repository<Stats>;
  static connection: DataSource;
  static isConnecting: boolean;

  static async createDBConnection() {
    try {
      console.debug('DB CONNECTION CREATION => ');
      DB.connection = new DataSource({
        database: DB_NAME,
        entities: [Chat, Stats],
        location: '.',
        logging: ['error', 'info', 'log' /* 'query', 'schema', */, 'warn'],
        synchronize: true,
        type: 'react-native',
        driver: typeORMDriver,
      });
      // console.log('DB CONNECTION CREATED => ', DB.connection);
      DB.connection = await DB.connection.initialize();
    } catch (err) {
      console.log('DB CONNECTION ERROR => ', err, DB.connection);
    }
  }

  static async refreshConnection(): Promise<void> {
    if (!DB.connection) {
      await DB.createDBConnection();
    }
    if (DB.connection && !DB.connection.isInitialized) {
      console.debug('[DBService] Recreate new connection');
      DB.connection = await DB.connection.initialize();
    }
    console.log('[DB SERVICE] CONECTION CONNECTED => ');
  }

  static async initRepositories() {
    //may throw error
    DB.chatRepository =
      DB.chatRepository || (await DB.connection.getRepository(Chat));
    DB.statsRepository =
      DB.statsRepository || (await DB.connection.getRepository(Stats));
  }

  static async connect() {
    if (DB.connection && DB.connection.isConnected) {
      return;
    }
    console.log('[DBService]', 'DB should connect', DB.isConnecting);
    while (DB.isConnecting) {
      //console.log('[DBSERVICE] Stuck in connecting...')
      setTimeout(() => {
        console.log('[DBService]', 'DB Service pending connection...');
      }, 200);
    }
    try {
      DB.isConnecting = true;
      console.log('[DBService]', 'Start connect', DB.isConnecting);
      await DB.refreshConnection();
      console.log('[DBService]', 'Connection refreshed');
      await DB.initRepositories();
      console.debug('[DBService] Got DB connection', DB.connection.name);
      DB.isConnecting = false;
    } catch (err) {
      DB.isConnecting = false;
      console.log('[DBService] Error getting DB connection: ' + err);
      console.log(err instanceof CustomRepositoryNotFoundError);
      if (err instanceof CustomRepositoryNotFoundError) {
        console.log('[DB SERVICE] err => ', err);
        await DB.createDBConnection();
        await DB.connection.initialize();
        await DB.initRepositories();
      }
    } finally {
      DB.isConnecting = false;
      console.log('[DBService]', 'End connect', DB.isConnecting);
    }
  }

  static async createNewChat(chat: chat): Promise<void> {
    console.log('DB CONNECTION => createChat');
    try {
      await DB.connect();
      await DB.chatRepository?.save(new Chat(chat));
      console.debug('[DBService] Stored chat => ' + chat.id);
    } catch (error) {
      console.log('[DBService] Error adding chat: ', error);
    }
  }

  static async getAllChats(): Promise<chat[]> {
    console.log('DB CONNECTION => getAllChats');
    try {
      await DB.connect();
      let chats = await DB.chatRepository?.find({
        relations: {
          stats: true,
        },
      });
      console.debug('[DBService] Got ' + chats?.length + ' chats.');
      return chats?.map(c => c.toChat());
    } catch (e) {
      console.log('[DBService] Error getting chat: ' + e);
    }
    return [];
  }
}

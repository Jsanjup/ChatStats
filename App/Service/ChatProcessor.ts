import {Buffer} from 'buffer';
import RNFS from 'react-native-fs';
import {streamFileFromZip} from 'react-native-zip-stream';
import {ChatLine} from '../Model/Types';
import {SharedItem} from './ChatManager';

const chatRegex =
  /(\d{1,2}\/\d{1,2}\/\d{1,2}), (\d{1,2}:\d{1,2}) \- (.*:)?(.*)/;
export class ChatProcessor {
  static async process(
    item: SharedItem,
  ): Promise<{id: string; lines: ChatLine[]}> {
    console.log('[Chat Processor]', item);
    if (typeof item.data === 'string') {
      console.log('[Chat Processor]', item.data, item.mimeType);
      return await this.processFile(item.data, item.mimeType);
    }
    if ((item.data as any[]).length >= 1) {
      console.log('[Chat Processor]', item, item.data[0], item.data[1]);
      return await this.processFile(item.data[0], item.data[1]);
    }
    return {lines: [], id: ''};
  }

  private static async processFile(
    filepath: string,
    mimetype?: string,
  ): Promise<{id: string; lines: ChatLine[]}> {
    const {id, content} = await this.readFile(filepath, mimetype);
    const lines = this.getLines(content);
    return {id: id, lines: await this.parseLines(lines)};
  }

  private static async readFile(
    filepath: string,
    mimeType?: string,
  ): Promise<{id: string; content: string}> {
    console.log('Trying to open file at', filepath);
    try {
      let destPath = filepath;
      let id = destPath;
      if (filepath.startsWith('content://')) {
        const uriComponents = filepath.split('/');
        const fileNameAndExtension = uriComponents[uriComponents.length - 1];
        destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`;
        id = fileNameAndExtension;
        await RNFS.copyFile(filepath, destPath);
      }
      console.log('Data loaded at ', destPath, '. Beginning to read...');

      let data: string = '';

      if (mimeType?.includes('zip')) {
        //console.log('Zip file!!');
        //Alternative way, also working
        // const n = `${RNFS.TemporaryDirectoryPath}/${id}-2`;
        // let f = await unzip(destPath, n);
        // data = await RNFS.readFile(`${f}/${id}.txt`);

        data = (await streamFileFromZip(
          destPath,
          `${id}.txt`,
          'string',
        )) as string;
      } else {
        const reader = await RNFS.readFile(destPath, 'base64');
        // console.log('Data read. Converting from base64...');
        data = Buffer.from(reader, 'base64').toString('utf-8');
      }
      // console.log('Data converted. Ready to parse.');
      return {id: id, content: data};
    } catch (err) {
      console.log('Error reading file', err);
      return {id: '', content: ''};
    }
  }

  private static getLines(data: string): string[] {
    let split = data.split('\n');
    let counter = -1;
    let lines = [];
    for (let s of split) {
      if (s.match(chatRegex)) {
        lines.push(s);
        counter++;
      } else {
        if (counter >= 0) {
          lines[counter] += '\n' + s;
        }
      }
    }
    return lines;
  }

  private static parseLines(lines: string[]): ChatLine[] {
    // console.debug('Parsing ', lines.length, ' lines...');
    return lines
      .map((line: string) => this.parseLine(line))
      .filter(l => l !== undefined) as ChatLine[];
  }

  private static parseLine(line: string): ChatLine | undefined {
    try {
      // console.debug('[Chat Processor]', 'Parse line', line);
      let [time, msg] = line.split('-');
      let [day, hour] = time.split(',');
      hour = hour?.trim();
      let [author, content] = msg.split(':');
      author = author?.trim();
      content = content?.trim();
      return {
        author: author,
        contents: content,
        day: day,
        hour: hour,
      };
    } catch (e) {
      console.log('Error parsing line', line, e);
      return;
    }
  }
}

import moment from 'moment';
import {stats} from '../Model/Stat';
import {ChatLine, dayTime, weekday} from '../Model/Types';
import {Time} from '../util/Time';
import {HitCount} from './Counter';

let counter = /[x|\*] {0,1}(\d)+/gim;

export class ChatAnalyzer {
  static expected: RegExp | undefined = undefined;

  static setFilter(word: RegExp) {
    this.expected = word;
  }

  static analyze(id: string, lines: ChatLine[]): stats {
    let hitCount = new HitCount();
    let stats: stats = {
      excluded: [],
      id: id,
      stats: [],
      authors: [],
    };

    console.debug(
      '[ChatAnalyzer]',
      'Analyizing lines that match',
      lines.length,
      this.expected,
    );
    // lines.push({
    //   day: '22/1/24',
    //   hour: '18:22',
    //   contents: 'lavadora x3\nlavadora x2',
    //   author: 'José San Juan',
    // });
    for (let line of lines) {
      let count = this.lineMatches(line.contents);
      if (count > 0) {
        let {day, weekday, hour, date} = this.convertHour(
          line.day,
          line.hour,
          line.contents,
        );
        if (!stats.firstDate) {
          stats.firstDate = date.valueOf();
        }
        stats.lastDate = date.valueOf();
        hitCount.upsert(date, count, line.author, day, weekday, hour);
      } else {
        stats.excluded.push(line.contents);
      }
    }
    console.debug(
      '[ChatAnalyzer]',
      'Hits finished' /*JSON.stringify(hitCount)*/,
    );
    stats.authors = hitCount.getAuthorList();
    stats.stats = hitCount.getStats();
    console.debug('Analysis done' /*stats*/);
    //TODO: save in DB
    return stats;
  }

  private static lineMatches(line: string): number {
    if (!line) {
      return 0;
    }
    if (!this.expected) {
      return 1;
    }
    line = line.toLowerCase();
    const match = line.match(this.expected);
    // console.debug(
    //   '[ChatAnalyzer]',
    //   'line matches',
    //   line,
    //   match,
    //   match?.length,
    //   this.expected,
    // );
    let count = match?.length || 0;
    if (count) {
      const cmatch = line.match(counter);
      if (cmatch) {
        for (let c of cmatch) {
          let n = parseInt(c.replace(/x|X|\*/, '').trim());
          count += n - 1;
        }
        // console.debug('[ChatAnalyzer]', 'counter matches', line, count);
      }
    }
    return count;
  }

  private static convertHour(
    day: string,
    hour: string,
    contents: string,
  ): {day: string; weekday: weekday; hour: dayTime; date: moment.Moment} {
    let [h, m] = hour.split(':');
    let hint = parseInt(h);
    let yesterday = contents.includes('ayer');
    let daytime: dayTime;
    if (hint < 7 || hint > 20) {
      if (hint < 7) {
        yesterday = true;
      }
      daytime = 'night';
    } else if (hint < 12) {
      daytime = 'morning';
    } else if (hint < 18) {
      daytime = 'afternoon';
    } else {
      daytime = 'evening';
    }
    let date = Time.toDate(day);
    if (yesterday) {
      date = date.subtract(1, 'day');
      day = Time.fromDate(date);
    }
    let weekday = Time.getWeekday(date);
    return {day: day, weekday: weekday, hour: daytime, date: date};
  }
}

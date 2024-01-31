import moment, {Moment} from 'moment';
import {Author, Hit, Stat, dayTime, weekday} from '../Model/Types';
import {Time} from '../util/Time';

export class HitCount {
  private count: Hit[];
  private authorList: string[];
  private stats?: Stat[];
  private isSorted = false;

  public constructor() {
    this.count = [];
    this.authorList = [];
  }

  public withTotals(totals: Hit[], authorList: string[]) {
    this.authorList = authorList;
    this.count = totals;
  }

  getAuthorList(): string[] {
    return this.authorList.sort();
  }

  upsert(
    t: Moment,
    value: number,
    author: string,
    day: string,
    weekday: weekday,
    hour: dayTime,
  ) {
    if (!this.authorList.includes(author)) {
      this.authorList.push(author);
    }
    this.count.push({
      t: t,
      author: author,
      daytime: hour,
      day: day,
      weekday: weekday,
      value: value,
    });
  }

  sortHits(hits: Hit[]): void {
    hits = hits.sort((a: Hit, b: Hit) => {
      if (a.t.isSame(b.t)) {
        return a.author < b.author ? -1 : 1;
      }
      return a.t.diff(b.t);
    });
  }

  fillHits(hits: Hit[], first: Moment, last?: Moment) {
    let authors = this.getAuthorList();
    let counter = 0;
    if (!last) {
      last = moment();
    }
    while (first.isSameOrBefore(last)) {
      // console.debug(
      //   '[HitCount]',
      //   'In Loop',
      //   'Has first gotten to last?',
      //   Time.fromDate(first),
      //   first,
      //   Time.fromDate(last),
      // );
      let hit = hits[counter];
      let authorsToFill: string[] = [];
      if (first.isBefore(hit.t)) {
        // console.debug(
        //   '[HitCount]',
        //   'First before next hit',
        //   Time.fromDate(first),
        //   hit.day,
        // );
        authorsToFill = authors;
      } else {
        let matchingHits = [];
        // console.debug(
        //   '[HitCount]',
        //   'First after or next hit',
        //   Time.fromDate(first),
        //   hit.day,
        // );
        while (hit && first.isSameOrAfter(hit.t)) {
          // console.debug(
          //   '[HitCount]',
          //   'In Loop in loop',
          //   'Matching',
          //   Time.fromDate(first),
          //   hit.day,
          //   hit.t,
          //   authorsToFill,
          //   hit,
          // );
          matchingHits.push(hit);
          counter++;
          hit = hits[counter];
        }
        let authFound = matchingHits.map(h => h.author);
        authorsToFill = authors.filter(a => !authFound.includes(a));
      }
      // console.debug(
      //   '[HitCount]',
      //   'In Loop',
      //   'Authors to fill',
      //   Time.fromDate(first),
      //   authorsToFill,
      // );
      const allHits = authorsToFill.map(a => {
        return {
          author: a,
          t: first.clone(),
          daytime: 'morning',
          day: Time.fromDate(first),
          weekday: Time.getWeekday(first),
          value: 0,
        } as Hit;
      });
      hits.splice(counter, 0, ...allHits);
      counter += allHits.length;
      // console.debug(
      //   '[HitCount]',
      //   'Increment first',
      //   Time.fromDate(first),
      //   Time.fromDate(last),
      // );
      first = first.add(1, 'day');
    }
  }

  sortAndFill(first?: Moment, last?: Moment): void {
    // console.debug('[HitCount]', 'SortAndFill', 'Presorting');
    this.sortHits(this.count); //presort necessary?
    // console.debug('[HitCount]', 'Presorted', JSON.stringify(this.count));
    let firstT = this.count[0].t;
    const lastT = this.count[this.count.length - 1].t;
    // console.debug('[HitCount]', 'Filling hits between... ', firstT, lastT);
    this.fillHits(this.count, firstT, lastT);
    // console.debug('[HitCount]', 'Filled');
    if (first) {
      // console.debug('[HitCount]', 'Filling hits before ...', first, firstT);
      this.fillHits(this.count, first, last);
      // console.debug('[HitCount]', 'Filled');
    }
    // console.debug('[HitCount]', 'Sorting');
    this.sortHits(this.count);
    console.debug('[HitCount]', 'Sorted and filled');
    this.isSorted = true;
  }

  getStats(first?: Moment, last?: Moment): Stat[] {
    if (this.stats?.length) {
      return this.stats;
    }
    if (!this.isSorted) {
      this.sortAndFill();
    }
    let stats: Stat[] = [];
    this.count.forEach((h: Hit) => {
      HitCount.addToStatList(stats, HitCount.toStat(h));
    });
    this.stats = stats;
    if (!first) {
      return stats;
    }
    if (!last) {
      last = moment();
    }
    return stats.filter(s => s.t >= first.valueOf() && s.t <= last!.valueOf());
  }

  static filterDates(stats: Stat[], first?: Moment, last?: Moment): Stat[] {
    if (!first) {
      first = moment(stats[0].t);
    }
    if (!last) {
      last = moment();
    }
    return stats.filter(s => s.t >= first!.valueOf() && s.t <= last!.valueOf());
  }

  static toStat(h: Hit): Stat {
    return {
      t: h.t.valueOf(),
      day: h.day,
      author: h.author,
      weekday: h.weekday,
      night: h.daytime === 'night' ? h.value : 0,
      morning: h.daytime === 'morning' ? h.value : 0,
      afternoon: h.daytime === 'afternoon' ? h.value : 0,
      evening: h.daytime === 'evening' ? h.value : 0,
      total: h.value,
    };
  }

  static groupByDay(stat: Stat[], authorCount: number): Stat[][] {
    let statGrouped: Stat[][] = [];
    if (stat.length % authorCount !== 0) {
      console.warn(
        "Interpolation doesn't seem correct",
        'Values are missing or repeated',
        stat.length,
        authorCount,
      );
    }
    for (let i = 0; i < stat.length; i += authorCount) {
      let dayGroup = stat.slice(i, i + authorCount);
      statGrouped.push(dayGroup);
    }
    return statGrouped;
  }

  static getDates(list: Stat[]): string[] {
    let dates: string[] = [];
    list.forEach(st => {
      if (!dates.includes(st.day)) {
        dates.push(st.day);
      }
    });
    return dates;
  }

  static addToStatList(list: Stat[], stat: Stat): void {
    let index = list.findIndex(
      (s: Stat) => s.day === stat.day && s.author === stat.author,
    );
    if (index >= 0) {
      let st = list[index];
      st.night += stat.night;
      st.morning += stat.morning;
      st.afternoon += stat.afternoon;
      st.evening += stat.evening;
      st.total += stat.total;
      list.splice(index, 1, st);
    } else list.push(stat);
  }

  static getTotalByAuthor(author: Author, stats: Stat[]): number {
    let stat = stats
      .filter(st => st.author === author)
      .reduce((prev, current) => {
        prev.total += current.total;
        return prev;
      });
    return stat.total;
  }
}

import moment from 'moment';
import {weekday} from '../Model/Types';

export const day_format = 'D/M/YY';
const weekdays: weekday[] = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export class Time {
  static toDate(d: string): moment.Moment {
    return moment(d, day_format);
  }

  static fromDate(d: moment.Moment): string {
    return d.format(day_format);
  }

  static getWeekday(d: moment.Moment): weekday {
    return weekdays[d.weekday()];
  }

  static getDaysBetweenDates(
    begin: moment.Moment,
    end: moment.Moment,
  ): string[] {
    let days: string[] = [];
    do {
      days.push(Time.fromDate(begin));
      begin = begin.add(1, 'day');
    } while (begin.isSameOrBefore(end));
    return days;
  }

  static getWeekWindow(
    d?: moment.Moment,
  ): [first: moment.Moment, last: moment.Moment] {
    if (!d) {
      d = moment();
    }
    const first = moment().year(d.year()).isoWeek(d.isoWeek()).isoWeekday(1);
    const last = first.add(7, 'd');
    return [first, last];
  }

  static getMonthWindow(
    d?: moment.Moment,
  ): [first: moment.Moment, last: moment.Moment] {
    if (!d) {
      d = moment();
    }
    const first = moment().year(d.year()).month(d.month()).day(1);
    const last = first.add(1, 'm').subtract(1, 'd');
    return [first, last];
  }

  static getYearWindow(
    d?: moment.Moment,
  ): [first: moment.Moment, last: moment.Moment] {
    if (!d) {
      d = moment();
    }
    const first = moment().year(d.year()).month(1).day(1);
    const last = moment().year(d.year()).month(12).day(31);
    return [first, last];
  }

  static getWeeksBetweenDates(
    begin: moment.Moment,
    end: moment.Moment,
  ): string[] {
    let days: string[] = [];
    do {
      days.push(begin.format('WW'));
      begin = begin.add(1, 'week');
    } while (begin.isSameOrBefore(end));
    return days;
  }

  static getMonthsBetweenDates(
    begin: moment.Moment,
    end: moment.Moment,
  ): string[] {
    let months: string[] = [];
    do {
      months.push(begin.format('MM'));
      begin = begin.add(1, 'month');
    } while (begin.month() <= end.month() && begin.year() <= end.year());
    return months;
  }

  static getYearsBetweenDates(
    begin: moment.Moment,
    end: moment.Moment,
  ): string[] {
    let days: string[] = [];
    do {
      days.push(begin.format('YY'));
      begin = begin.add(1, 'year');
    } while (begin.year() <= end.year());
    return days;
  }

  static getDaysInWeek(week: string, year: string): string[] {
    let d = moment().year(parseInt(year)).isoWeek(parseInt(week)).isoWeekday(1);
    const end = d.clone().add(1, 'week');
    let days: string[] = [];
    do {
      days.push(Time.fromDate(d));
      d = d.add(1, 'day');
    } while (d.isBefore(end));
    return days;
  }

  static getDaysInMonth(month: string, year: string): string[] {
    let d = moment().year(parseInt(year)).month(parseInt(month)).day(1);
    const end = d.clone().add(1, 'month');
    let days: string[] = [];
    do {
      days.push(Time.fromDate(d));
      d = d.add(1, 'day');
    } while (d.isBefore(end));
    return days;
  }

  static getDaysInYear(year: string): string[] {
    let d = moment().year(parseInt(year)).month(1).day(1);
    const end = d.clone().add(1, 'year');
    let days: string[] = [];
    do {
      days.push(Time.fromDate(d));
      d = d.add(1, 'day');
    } while (d.isBefore(end));
    return days;
  }
}

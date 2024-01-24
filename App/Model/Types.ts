import {Moment} from 'moment';

export type dayTime = 'night' | 'morning' | 'afternoon' | 'evening';
export type weekday = 'L' | 'M' | 'X' | 'J' | 'V' | 'S' | 'D';
export type Author = string;
export type Day = string;
export type DayMap = {map: Map<dayTime, number>; weekday: weekday};

export type Stat = {
  t: number;
  day: Day;
  author: Author;
  night: number;
  morning: number;
  afternoon: number;
  evening: number;
  weekday: weekday;
  total: number;
};

export type Hit = {
  author: Author;
  t: Moment;
  daytime: dayTime;
  day: Day;
  weekday: weekday;
  value: number;
};

export type ChatLine = {
  author: string;
  day: string;
  hour: string;
  contents: string;
};

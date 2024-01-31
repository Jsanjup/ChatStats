import moment from 'moment';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm/browser';
import {Stats, stats} from './Stat';

export type chat = {
  id: string;
  lastDate: moment.Moment;
  stats: stats;
  wordfilter?: string;
  additionalFilters?: string[];
};

@Entity('chat')
export class Chat {
  @PrimaryColumn('text')
  id: string;

  @Column('datetime')
  lastTime: number;

  @OneToOne(() => Stats, stats => stats.chat, {
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  //@ts-ignore
  stats: Stats;

  @Column('text', {nullable: true})
  wordfilter?: string;

  @Column('text', {nullable: true})
  additionalFiltersArray?: string;

  constructor(chat?: chat) {
    this.id = chat?.id || '';
    this.lastTime = chat?.lastDate.valueOf() || 0;

    if (chat) this.stats = new Stats(chat?.stats);
    this.additionalFilters = chat?.additionalFilters;
    this.wordfilter = chat?.wordfilter;
  }

  toChat(): chat {
    return {
      id: this.id,
      lastDate: this.lastDate,
      stats: this.stats?.toStats(),
      additionalFilters: this.additionalFilters,
      wordfilter: this.wordfilter,
    };
  }

  get additionalFilters(): string[] | undefined {
    if (!this.additionalFiltersArray) {
      return;
    }
    return JSON.parse(this.additionalFiltersArray) as string[];
  }

  set additionalFilters(additionalFilters: string[] | undefined) {
    if (additionalFilters) {
      this.additionalFiltersArray = JSON.stringify(additionalFilters);
    }
  }

  set lastDate(t: moment.Moment) {
    this.lastTime = t.valueOf();
  }

  get lastDate(): moment.Moment {
    return moment(this.lastTime);
  }
}

import {
  Column,
  Entity,
  JoinTable,
  OneToOne,
  PrimaryColumn,
} from 'typeorm/browser';
import {Stats, stats} from './Stat';

export type chat = {
  id: string;
  authors: string[];
  lastDate: Date;
  stats: stats;
};

@Entity('chat')
export class Chat {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  authors: string;

  @Column('datetime')
  lastTime: number;

  @OneToOne(type => Stats, {
    cascade: ['insert'],
  })
  @JoinTable()
  stats: Stats;

  constructor(chat: chat) {
    this.id = chat.id;
    this.authors = JSON.stringify(chat.authors);
    this.lastTime = chat.lastDate.getTime();
    this.stats = new Stats(chat.stats);
  }

  toChat(): chat {
    return {
      id: this.id,
      authors: this.authorsArray,
      lastDate: this.lastDate,
      stats: this.stats.toStats(),
    };
  }

  get authorsArray(): string[] {
    return JSON.parse(this.authors) as string[];
  }

  set authorsArray(authors: string[]) {
    this.authors = JSON.stringify(authors);
  }

  set lastDate(t: Date) {
    this.lastTime = t.getTime();
  }

  get lastDate(): Date {
    return new Date(this.lastTime);
  }
}

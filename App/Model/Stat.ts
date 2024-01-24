import {Column, Entity, PrimaryColumn} from 'typeorm/browser';
import {Stat} from './Types';

export type stats = {
  id: string;
  firstDate?: number;
  lastDate?: number;
  stats: Stat[];
  authors: string[];
  excluded: string[];
};

@Entity('stats')
export class Stats {
  @PrimaryColumn('text')
  id: string;

  @Column('datetime')
  firstDate: number;

  @Column('datetime')
  lastDate: number;

  @Column('text')
  parsedStats: string;

  @Column('text')
  parsedAuthors: string;

  constructor(stats: stats) {
    this.id = stats.id;
    this.firstDate = stats.firstDate || 0;
    this.lastDate = stats.lastDate || 0;
    this.parsedStats = JSON.stringify(stats.stats);
    this.parsedAuthors = JSON.stringify(stats.authors);
  }

  toStats(): stats {
    return {
      excluded: [],
      id: this.id,
      firstDate: this.firstDate,
      lastDate: this.lastDate,
      stats: this.stats,
      authors: this.authors,
    };
  }

  get stats(): Stat[] {
    return JSON.parse(this.parsedStats);
  }

  set stats(stats: Stat[]) {
    this.parsedStats = JSON.stringify(stats);
  }

  get authors(): string[] {
    return JSON.parse(this.parsedAuthors);
  }

  set authors(authors: string[]) {
    this.parsedAuthors = JSON.stringify(authors);
  }
}

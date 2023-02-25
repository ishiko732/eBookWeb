import { Dayjs } from "dayjs";

export enum State {
  New,
  Learning,
  Review,
  Relearning,
}

export enum Rating {
  Again,
  Hard,
  Good,
  Easy,
}

export interface ReviewLog {
  rating: Rating;
  state: State;
  elapsed_days: number;
  scheduled_days: number;
  review: Dayjs;
}

export interface Card {
  due: Dayjs;
  stability: number; // 稳定性
  difficulty: number; //难度
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: State;
  last_review?: Dayjs;
}

export interface SchedulingLog {
  [key: number]: {
    card: Card;
    log: ReviewLog;
  };
}

export class Parameters {
  public request_retention: number;
  public maximum_interval: number;
  public easy_bonus: number;
  public hard_factor: number;
  public w: number[];

  constructor(
    request_retention?: number,
    maximum_interval?: number,
    easy_bonus?: number,
    hard_factor?: number,
    w?: number[]
  ) {
    this.request_retention = request_retention || 0.9;
    this.maximum_interval = maximum_interval || 36500;
    this.easy_bonus = easy_bonus || 1.3;
    this.hard_factor = hard_factor || 1.2;
    this.w = w || [1, 1, 5, -0.5, -0.5, 0.2, 1.4, -0.12, 0.8, 2, -0.2, 0.2, 1];
  }
}

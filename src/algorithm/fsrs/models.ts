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

export interface Parameters {
  request_retention: number;
  maximum_interval: number;
  easy_bonus: number;
  hard_factor: number;
  w: number[];
  enable_fuzz: boolean;
}

export const generatorParameters = (props?: {
  request_retention?: number;
  maximum_interval?: number;
  easy_bonus?: number;
  hard_factor?: number;
  w?: number[];
  enable_fuzz?: boolean;
}) => {
  if (!props) {
    return {
      request_retention: 0.9,
      maximum_interval: 36500,
      easy_bonus: 1.3,
      hard_factor: 1.2,
      w: [1, 1, 5, -0.5, -0.5, 0.2, 1.4, -0.12, 0.8, 2, -0.2, 0.2, 1],
      enable_fuzz: false,
    };
  }
  return {
    request_retention: props.request_retention || 0.9,
    maximum_interval: props.maximum_interval || 36500,
    easy_bonus: props.easy_bonus || 1.3,
    hard_factor: props.hard_factor || 1.2,
    w: props.w || [1, 1, 5, -0.5, -0.5, 0.2, 1.4, -0.12, 0.8, 2, -0.2, 0.2, 1],
    enable_fuzz: props.enable_fuzz || false,
  };
};

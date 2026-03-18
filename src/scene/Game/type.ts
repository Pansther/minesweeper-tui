export enum ItemType {
  Blank = 0,
  Open = 1,
  Flag = 2,
}

export enum MineType {
  Empty = 0,
  Mine = 1,
}

export enum Difficulty {
  Easy = 1,
  Medium = 2,
  Hard = 3,
}

export enum GameState {
  Idle = 'idle',
  Play = 'play',
  Fail = 'fail',
  Complete = 'complete',
}

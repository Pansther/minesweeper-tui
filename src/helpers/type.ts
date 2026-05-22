import type { GameContextValue } from '@/scene/Game/context/type'
import type { Difficulty } from '@/scene/Game/type'
import type { AvailableTheme } from '@/store/type'

export interface Config {
  theme: AvailableTheme
  difficulty: Difficulty
  isShowKey: boolean
}

export type GameSave = Pick<
  GameContextValue,
  'mines' | 'hintAmount' | 'playRows'
> & {
  initTime: number
}

export interface GameStatItem {
  win: number
  total: number
  totalDuration: number
  totalSafeCell: number
  totalSafeCellOpened: number
  mineFlagged: number
  bestTime: number
}

export interface GameStats {
  overall: GameStatItem
  detail: Record<Difficulty, GameStatItem>
}

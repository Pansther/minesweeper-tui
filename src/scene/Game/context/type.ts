import { Updater } from 'use-immer'
import type { GameState } from '../type'

export interface GameContextValue {
  selectedIndex: {
    row: number
    col: number
  }
  hintAmount: number
  hintIndex: number[]
  mines: number[][]
  playState: GameState
  playRows: number[][]
  isPlay: boolean
  initTime?: number
  restart: () => void
}

export type GameContextType = [
  GameContextValue,
  setState: Updater<GameContextValue>,
]

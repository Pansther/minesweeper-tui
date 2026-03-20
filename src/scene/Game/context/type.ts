import type { GameState } from '../type'
import { Updater } from 'use-immer'

export interface GameContextValue {
  selectedIndex: {
    row: number
    col: number
  }
  hintAmount: number
  mines: number[][]
  playState: GameState
  playRows: number[][]
  isPlay: boolean
  restart: () => void
}

export type GameContextType = [
  GameContextValue,
  setState: Updater<GameContextValue>,
]

import { useImmer } from 'use-immer'
import { createContext, useContext } from 'react'
import { CONFIG, createEmptyGrid } from '../helper'
import { Difficulty, GameState } from '../type'
import type { GameContextType } from './type'

const { Idle, Play } = GameState

const DEFAULT_PLAYROWS_CONFIG = CONFIG[Difficulty.Hard]

const DEFAULT_VALUE: GameContextType = [
  {
    selectedIndex: {
      row: Math.floor(DEFAULT_PLAYROWS_CONFIG.rows / 2),
      col: Math.floor(DEFAULT_PLAYROWS_CONFIG.cols / 2),
    },
    hintAmount: 3,
    hintIndex: [],
    mines: [] as number[][],
    playState: GameState.Idle,
    playRows: createEmptyGrid(
      DEFAULT_PLAYROWS_CONFIG.rows,
      DEFAULT_PLAYROWS_CONFIG.cols,
    ),
    isPlay: false,
    restart: () => null,
  },
  () => {},
]

const GameContext = createContext<GameContextType>(DEFAULT_VALUE)

export const GameContextProvider = ({
  children,
}: {
  children?: React.ReactNode
}) => {
  const [state, setState] = useImmer(DEFAULT_VALUE[0])

  const isPlay = [Idle, Play].includes(state.playState)

  const restart = () => {
    setState(DEFAULT_VALUE[0])
  }

  return (
    <GameContext.Provider value={[{ ...state, isPlay, restart }, setState]}>
      {children}
    </GameContext.Provider>
  )
}

const useGameContext = () => useContext(GameContext)

export default useGameContext

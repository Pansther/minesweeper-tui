import { useImmer } from 'use-immer'
import { createContext, useContext } from 'react'
import { clearSaveGame, getGameSave } from '@/helpers/game'
import useStore from '@/store'
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
    initTime: 0,
    restart: () => null,
  },
  () => {},
]

const GameContext = createContext<GameContextType>(DEFAULT_VALUE)

export const GameContextProvider = ({
  children,
  isResume = false,
}: {
  isResume?: boolean
  children?: React.ReactNode
}) => {
  const difficulty = useStore((s) => s.difficulty)

  const config = CONFIG[difficulty]
  const gameSave = isResume ? getGameSave() : undefined

  let defaultState = {
    ...DEFAULT_VALUE[0],
    selectedIndex: {
      row: Math.floor(config.rows / 2),
      col: Math.floor(config.cols / 2),
    },
    playRows: createEmptyGrid(config.rows, config.cols),
  }
  let saveState = { ...defaultState }

  if (gameSave) {
    saveState = { ...defaultState, ...gameSave, playState: GameState.Play }
  }

  const [state, setState] = useImmer(gameSave ? saveState : defaultState)

  const isPlay = [Idle, Play].includes(state.playState)

  const restart = () => {
    clearSaveGame()
    setState(defaultState)
  }

  return (
    <GameContext.Provider value={[{ ...state, isPlay, restart }, setState]}>
      {children}
    </GameContext.Provider>
  )
}

const useGameContext = () => useContext(GameContext)

export default useGameContext

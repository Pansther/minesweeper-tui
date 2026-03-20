import { useEffect } from 'react'
import { useKeybindings } from 'giggles'
import useStore from '@/store'
import useGameContext from '../context'
import {
  checkAllowOpenAdjacent,
  checkMines,
  countAdjacentMines,
  flagAdjacent,
  generateMines,
  hint,
  openAdjacent,
  revealEmptyCells,
} from '../helper'
import { GameState, ItemType } from '../type'

const { Blank, Flag, Open } = ItemType
const { Idle, Play, Fail, Complete } = GameState

const useInteract = (focus: { id: string }) => {
  const [game, setGame] = useGameContext()
  const difficulty = useStore((s) => s.difficulty)

  const openItem = () => {
    const { row, col } = game.selectedIndex

    if (game.playState === Idle) {
      setGame((s) => {
        s.playState = Play
        s.mines = generateMines(difficulty, { row, col })
        s.playRows = revealEmptyCells(s.playRows, s.mines, row, col)
      })
    }

    if (game.playState !== Play) return

    const itemStatus = game.playRows[row][col]

    if (itemStatus === Open) {
      const adjacentMinesAmount = countAdjacentMines(game.mines, row, col)

      if (adjacentMinesAmount === 0) {
        setGame((s) => {
          s.playRows = revealEmptyCells(s.playRows, s.mines, row, col)
          s.playState = checkPlayRowsAndMines(s.playRows, s.mines)
        })
      } else {
        const isAllowOpenAdjacent = checkAllowOpenAdjacent(
          game.playRows,
          game.mines,
          row,
          col,
        )

        if (!isAllowOpenAdjacent) return

        setGame((s) => {
          s.playRows = openAdjacent(s.playRows, row, col)
          s.playState = checkPlayRowsAndMines(s.playRows, s.mines)
        })
      }
    } else if (itemStatus === Flag) {
      //
    } else {
      setGame((s) => {
        s.playRows[row][col] = Open
        s.playState = checkPlayRowsAndMines(s.playRows, s.mines)
      })
    }
  }

  const checkPlayRowsAndMines = (playRows: number[][], mines: number[][]) => {
    const isFoundMine = checkMines(playRows, mines)

    // hintItemIndex = [undefined, undefined]

    if (isFoundMine) return Fail

    return Play
  }

  const flagItem = () => {
    const { row, col } = game.selectedIndex

    if (game.playState !== Play) return

    const playRows = game.playRows

    const itemStatus = playRows[row][col]

    if (itemStatus === Open) {
      setGame((s) => {
        const newPlayRow = flagAdjacent(s.playRows, s.mines, row, col)

        s.playRows = newPlayRow ?? s.playRows
      })
    } else if (itemStatus === Flag) {
      setGame((s) => {
        s.playRows[row][col] = Blank
      })
    } else {
      setGame((s) => {
        s.playRows[row][col] = Flag
      })
    }
  }

  // eslint-disable-next-line
  const onHint = () => {
    const playState = game.playState
    const hintAmount = game.hintAmount
    const playRows = game.playRows
    const mines = game.mines

    if (playState !== Play) return
    if (hintAmount <= 0) return

    setGame((s) => {
      s.hintAmount -= 1
    })

    const hintItem = hint(playRows, mines)

    if (!hintItem) return

    // const { row, col } = hintItem

    // const item = document.querySelector(`#item-${row}-${col}`)
    //
    // if (!item) return
    //
    // item.scrollIntoView({
    //   block: 'center',
    //   inline: 'center',
    //   behavior: 'smooth',
    // })

    // hintItemIndex = [row, col]
  }

  useKeybindings(focus, {
    d: { action: openItem, name: 'Open' },
    f: { action: flagItem, name: 'Toggle Flag' },
  })

  useEffect(() => {
    const isAllOpen = game.playRows
      .flatMap((row) => row)
      .every((col) => col === Open || col === Flag)

    if (isAllOpen) game.playState = Complete
  }, [game])
}

export default useInteract

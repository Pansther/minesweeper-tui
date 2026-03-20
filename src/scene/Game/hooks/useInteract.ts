import useGameContext from '../context'
import {
  generateMines,
  revealEmptyCells,
  countAdjacentMines,
  checkAllowOpenAdjacent,
  openAdjacent,
  checkMines,
  flagAdjacent,
  hint,
} from '../helper'
import { ItemType, Difficulty, GameState } from '../type'

const { Blank, Flag, Open } = ItemType
const { Idle, Play, Fail } = GameState

const useInteract = ({ difficulty }: { difficulty: Difficulty }) => {
  const [game, setGame] = useGameContext()

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

  return {
    onHint,
    flagItem,
    openItem,
  }
}

export default useInteract

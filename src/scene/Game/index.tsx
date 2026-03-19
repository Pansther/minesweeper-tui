import cx from 'clsx'
import { useImmer } from 'use-immer'
import { useEffect } from 'react'
import { Box, Text } from 'ink'
import { useFocusNode, useKeybindingRegistry, useKeybindings } from 'giggles'
import useTheme from '@/hooks/useTheme'
import {
  CONFIG,
  checkAllowOpenAdjacent,
  checkIsAdjacent,
  checkMines,
  countAdjacentMines,
  countMinesAmount,
  createEmptyGrid,
  flagAdjacent,
  generateMines,
  hint,
  openAdjacent,
  revealEmptyCells,
} from './helper'
import { Difficulty, GameState, ItemType } from './type'

const { Blank, Flag, Open } = ItemType
const { Easy, Medium, Hard } = Difficulty
const { Idle, Play, Fail, Complete } = GameState

interface GameProps {
  difficulty?: Difficulty
}

const Game = ({ difficulty = Hard }: GameProps) => {
  const PlayRowsConfig = CONFIG[difficulty]

  const focus = useFocusNode()
  const registry = useKeybindingRegistry()

  const [game, setGame] = useImmer({
    selectedIndex: {
      row: Math.floor(PlayRowsConfig.rows / 2),
      col: Math.floor(PlayRowsConfig.cols / 2),
    },
    hintAmount: 3,
    mines: [] as number[][],
    playState: Idle,
    playRows: createEmptyGrid(PlayRowsConfig.rows, PlayRowsConfig.cols),
  })

  const theme = useTheme()

  const isPlay = [Idle, Play].includes(game.playState)
  const remaining = countMinesAmount(game.playRows, game.mines)

  const navigate = (key: 'up' | 'down' | 'left' | 'right') => {
    if (!isPlay) return

    switch (key) {
      case 'up':
        setGame((s) => {
          if (s.selectedIndex.row <= 0) {
            s.selectedIndex.row = s.playRows[0].length - 1
          } else {
            s.selectedIndex.row -= 1
          }
        })
        break
      case 'down':
        setGame((s) => {
          s.selectedIndex.row += 1
          s.selectedIndex.row %= s.playRows[0].length
        })
        break
      case 'left':
        setGame((s) => {
          if (s.selectedIndex.col <= 0) {
            s.selectedIndex.col = s.playRows[1].length - 1
          } else {
            s.selectedIndex.col -= 1
          }
        })
        break
      case 'right':
        setGame((s) => {
          s.selectedIndex.col += 1
          s.selectedIndex.col %= s.playRows[1].length
        })
        break
    }
  }

  const clickItem = () => {
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

  const restart = () => {
    setGame((s) => {
      s.selectedIndex = {
        row: Math.floor(PlayRowsConfig.rows / 2),
        col: Math.floor(PlayRowsConfig.cols / 2),
      }
      s.playState = Idle
      s.mines = []
      s.hintAmount = 3
      s.playRows = createEmptyGrid(
        CONFIG[difficulty].rows,
        CONFIG[difficulty].cols,
      )
    })
  }

  const onClickHint = () => {
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

    const { row, col } = hintItem

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

  useEffect(() => {
    const isAllOpen = game.playRows
      .flatMap((row) => row)
      .every((col) => col === Open || col === Flag)

    if (isAllOpen) game.playState = Complete
  }, [game])

  useKeybindings(focus, {
    j: { action: () => navigate('down'), name: 'Move Down' },
    down: { action: () => navigate('down'), name: 'Move Down' },
    k: { action: () => navigate('up'), name: 'Move Up' },
    up: { action: () => navigate('up'), name: 'Move Up' },
    h: { action: () => navigate('left'), name: 'Move Left' },
    left: { action: () => navigate('left'), name: 'Move Left' },
    l: { action: () => navigate('right'), name: 'Move Right' },
    right: { action: () => navigate('right'), name: 'Move Right' },
    a: { action: clickItem, name: 'Open' },
    f: { action: flagItem, name: 'Toggle Flag' },
    r: { action: restart, name: 'Restart' },
  })

  return (
    <Box flexDirection="column" gap={1} width="100%">
      <Box justifyContent="center">
        <Text>Remaining: {remaining}</Text>
      </Box>
      <Box flexDirection="column" alignItems="center">
        {game.playRows.map((rows, rowIndex) => {
          return (
            <Box key={rowIndex}>
              {rows.map((col, colIndex) => {
                const sRow = game.selectedIndex.row
                const sCol = game.selectedIndex.col

                const isSelected = sRow === rowIndex && sCol === colIndex
                const isSelectedOpen = game.playRows[sRow][sCol] === Open

                const isOpen = col === Open
                const isFlag = col === Flag
                const isMine = game.mines?.[rowIndex]?.[colIndex] || false
                const isShowMine = isMine && (isOpen || game.playState === Fail)
                const amount = countAdjacentMines(
                  game.mines,
                  rowIndex,
                  colIndex,
                )
                // const isHint =
                //   rowIndex === hintItemIndex[0] && colIndex === hintItemIndex[1]
                const isAdjacent = checkIsAdjacent(
                  rowIndex,
                  colIndex,
                  [game.selectedIndex.row, game.selectedIndex.col],
                  game.playRows,
                )

                const isShowAdjacent =
                  isSelectedOpen && game.playState === Play && isAdjacent

                const { close, dangers, flag, mine, open, selected, adjacent } =
                  theme.game

                const backgroundColor = cx({
                  [close]: !isSelected || !isPlay,
                  [adjacent]: isShowAdjacent,
                  [open]: isOpen,
                  [mine]: isShowMine,
                  [flag]: isFlag,
                  [selected]: isSelected && isPlay,
                })
                  ?.split(' ')
                  ?.at(-1)

                const color = cx('black', {
                  [dangers?.[amount - 1]]: isOpen,
                  black: isSelected,
                })
                  ?.split(' ')
                  ?.at(-1)

                return (
                  <Box
                    key={colIndex}
                    paddingX={1}
                    backgroundColor={backgroundColor}
                  >
                    <Text bold color={color}>
                      {isOpen && amount && !isMine
                        ? amount
                        : isFlag
                        ? 'F'
                        : isShowMine
                        ? '*'
                        : ' '}
                    </Text>
                  </Box>
                )
              })}
            </Box>
          )
        })}
      </Box>

      <Box gap={2}>
        {registry.available.map((cmd) => (
          <Box key={`${cmd.nodeId}-${cmd.key}`} gap={1}>
            <Text color="cyan">{cmd.key}</Text>
            <Text>{cmd.name}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Game

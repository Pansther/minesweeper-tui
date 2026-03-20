import useGameContext from '../context'
import { countAdjacentMines, checkIsAdjacent } from '../helper'
import { ItemType, GameState } from '../type'
import useTheme from '@/hooks/useTheme'
import cx from 'clsx'
import { Box, Text } from 'ink'

const { Flag, Open } = ItemType
const { Play, Fail } = GameState

interface ColProps {
  col: ItemType
  rowIndex: number
  colIndex: number
}

const Col = ({ col, rowIndex, colIndex }: ColProps) => {
  const theme = useTheme()
  const [game] = useGameContext()

  const isPlay = game.isPlay
  const sRow = game.selectedIndex.row
  const sCol = game.selectedIndex.col

  const isSelected = sRow === rowIndex && sCol === colIndex
  const isSelectedOpen = game.playRows[sRow][sCol] === Open

  const isOpen = col === Open
  const isFlag = col === Flag
  const isMine = game.mines?.[rowIndex]?.[colIndex] || false
  const isShowMine = isMine && (isOpen || game.playState === Fail)
  const amount = countAdjacentMines(game.mines, rowIndex, colIndex)
  // const isHint =
  //   rowIndex === hintItemIndex[0] && colIndex === hintItemIndex[1]
  const isAdjacent = checkIsAdjacent(
    rowIndex,
    colIndex,
    [game.selectedIndex.row, game.selectedIndex.col],
    game.playRows,
  )

  const isShowAdjacent = isSelectedOpen && game.playState === Play && isAdjacent

  const { close, dangers, flag, mine, open, selected, adjacent } = theme.game

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
    <Box paddingX={1} backgroundColor={backgroundColor}>
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
}

export default Col

import cx from 'clsx'
import { Box, Text } from 'ink'
import useTheme from '@/hooks/useTheme'
import useGameContext from '../context'
import { checkIsAdjacent, countAdjacentMines } from '../helper'
import { GameState, ItemType } from '../type'

const { Flag, Open } = ItemType
const { Play, Fail } = GameState

interface ColProps {
  col: ItemType
  rowIndex: number
  colIndex: number
}

const Col = ({ col, rowIndex, colIndex }: ColProps) => {
  const theme = useTheme()
  const [{ isPlay, playState, playRows, mines, selectedIndex, hintIndex }] =
    useGameContext()

  const sRow = selectedIndex.row
  const sCol = selectedIndex.col

  const isSelected = sRow === rowIndex && sCol === colIndex
  const isSelectedOpen = playRows[sRow][sCol] === Open

  const isOpen = col === Open
  const isFlag = col === Flag
  const isMine = mines?.[rowIndex]?.[colIndex] || false
  const isShowMine = isMine && (isOpen || playState === Fail)
  const amount = countAdjacentMines(mines, rowIndex, colIndex)
  const isHint = rowIndex === hintIndex[0] && colIndex === hintIndex[1]
  const isAdjacent = checkIsAdjacent(
    rowIndex,
    colIndex,
    [selectedIndex.row, selectedIndex.col],
    playRows,
  )

  const isShowAdjacent = isSelectedOpen && playState === Play && isAdjacent

  const { close, hint, dangers, flag, mine, open, selected, adjacent } =
    theme.game

  const backgroundColor = cx({
    [close]: !isSelected || !isPlay,
    [adjacent]: isShowAdjacent,
    [open]: isOpen,
    [mine]: isShowMine,
    [flag]: isFlag,
    [hint]: isHint,
    [selected]: isSelected && isPlay,
  })
    ?.split(' ')
    ?.at(-1)

  const color = cx('black', {
    [dangers?.[amount - 1]]: isOpen,
    black: isSelected || isHint,
  })
    ?.split(' ')
    ?.at(-1)

  return (
    <Box
      paddingX={1}
      minWidth={3}
      minHeight={1}
      alignItems="center"
      justifyContent="center"
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
}

export default Col

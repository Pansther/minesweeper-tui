import cx from 'clsx'
import { useImmer } from 'use-immer'
import { Box, Text } from 'ink'
import { useFocusNode, useKeybindingRegistry, useKeybindings } from 'giggles'
import { CONFIG, createEmptyGrid } from './helper'
import { Difficulty } from './type'

const DEFAULT_CONFIG = CONFIG[Difficulty.Hard]

const Game = () => {
  const focus = useFocusNode()
  const registry = useKeybindingRegistry()

  const [game, setGame] = useImmer({
    mines: [],
    selectedIndex: {
      row: 0,
      col: 0,
    },
    playRows: createEmptyGrid(DEFAULT_CONFIG.rows, DEFAULT_CONFIG.cols),
  })

  const navigate = (key: 'up' | 'down' | 'left' | 'right') => {
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

  useKeybindings(focus, {
    j: { action: () => navigate('down'), name: 'Move Down' },
    down: { action: () => navigate('down'), name: 'Move Down' },
    k: { action: () => navigate('up'), name: 'Move Up' },
    up: { action: () => navigate('up'), name: 'Move Up' },
    h: { action: () => navigate('left'), name: 'Move Left' },
    left: { action: () => navigate('left'), name: 'Move Left' },
    l: { action: () => navigate('right'), name: 'Move Right' },
    right: { action: () => navigate('right'), name: 'Move Right' },
  })

  return (
    <Box flexDirection="column" gap={1} width="100%">
      <Box flexDirection="column" alignItems="center">
        {game.playRows.map((rows, rowIndex) => {
          return (
            <Box key={rowIndex}>
              {rows.map((col, colIndex) => {
                const isSelected =
                  game.selectedIndex.row === rowIndex &&
                  game.selectedIndex.col === colIndex

                return (
                  <Box
                    key={colIndex}
                    paddingX={1}
                    backgroundColor={cx({
                      gray: !isSelected,
                      blue: isSelected,
                    })}
                  >
                    <Text>{col}</Text>
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

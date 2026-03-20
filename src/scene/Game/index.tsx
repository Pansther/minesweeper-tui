import Col from './components/Col'
import useGameContext from './context'
import { countMinesAmount } from './helper'
import useInteract from './hooks/useInteract'
import useNavigate from './hooks/useNavigate'
import { Difficulty, GameState, ItemType } from './type'
import { useFocusNode, useKeybindingRegistry, useKeybindings } from 'giggles'
import { Box, Text } from 'ink'
import { useEffect } from 'react'

const { Flag, Open } = ItemType
const { Hard } = Difficulty
const { Complete } = GameState

interface GameProps {
  difficulty?: Difficulty
}

const Game = ({ difficulty = Hard }: GameProps) => {
  const focus = useFocusNode()
  const registry = useKeybindingRegistry()

  const [game] = useGameContext()
  const { navigate } = useNavigate()
  const { flagItem, openItem } = useInteract({ difficulty })

  const remaining = countMinesAmount(game.playRows, game.mines)

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
    d: { action: openItem, name: 'Open' },
    f: { action: flagItem, name: 'Toggle Flag' },
    r: { action: game.restart, name: 'Restart' },
  })

  return (
    <Box flexDirection="column" gap={1} width="100%">
      <Box justifyContent="center">
        <Text>Remaining: {remaining}</Text>
      </Box>

      <Box flexDirection="column" alignItems="center">
        {game.playRows.map((rows, rowIndex) => (
          <Box key={rowIndex}>
            {rows.map((col, colIndex) => (
              <Col
                col={col}
                key={colIndex}
                rowIndex={rowIndex}
                colIndex={colIndex}
              />
            ))}
          </Box>
        ))}
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

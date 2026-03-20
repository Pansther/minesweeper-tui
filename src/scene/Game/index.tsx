import { Box, Text } from 'ink'
import { useFocusNode } from 'giggles'
import Col from './components/Col'
import Instruction from './components/Instruction'
import useGameContext from './context'
import { countMinesAmount } from './helper'
import useInteract from './hooks/useInteract'
import useNavigate from './hooks/useNavigate'

const Game = () => {
  const focus = useFocusNode()

  const [game] = useGameContext()

  const remaining = countMinesAmount(game.playRows, game.mines)

  useNavigate(focus)
  useInteract(focus)

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

      <Instruction />
    </Box>
  )
}

export default Game

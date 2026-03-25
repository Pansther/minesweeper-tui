import { Box } from 'ink'
import Col from './components/Col'
import Instruction from './components/Instruction'
import StatusBar from './components/StatusBar'
import useGameContext from './context'
import useInteract from './hooks/useInteract'
import useNavigate from './hooks/useNavigate'

const Game = ({ focus }: { focus: { id: string } }) => {
  const [game] = useGameContext()

  useNavigate(focus)
  useInteract(focus)

  return (
    <Box flexDirection="column" width="100%" padding={1}>
      <StatusBar />

      <Box
        width="100%"
        height="100%"
        marginTop={-1}
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
      >
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

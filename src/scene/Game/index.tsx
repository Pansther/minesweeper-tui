import { useRef } from 'react'
import { Box } from 'ink'
import Col from './components/Col'
import Instruction from './components/Instruction'
import StatusBar, { StatusBarRef } from './components/StatusBar'
import useGameContext from './context'
import useInteract from './hooks/useInteract'
import useNavigate from './hooks/useNavigate'

const Game = ({ focus }: { focus: { id: string } }) => {
  const [game] = useGameContext()

  const statusBarRef = useRef<StatusBarRef>(null)

  useInteract(focus)
  useNavigate({ focus, ref: statusBarRef })

  return (
    <Box flexDirection="column" width="100%" padding={1}>
      <StatusBar ref={statusBarRef} initTime={game?.initTime} />

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

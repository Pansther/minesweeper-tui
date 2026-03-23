import { useEffect } from 'react'
import { Box, Text } from 'ink'
import useGameContext from '../context'
import { countMinesAmount } from '../helper'
import useTimer from '../hooks/useTimer'
import { GameState } from '../type'

const { Idle, Play, Fail, Complete } = GameState

const padToTwoDigits = (num: number) => {
  return num.toString().padStart(2, '0')
}

const StatusBar = () => {
  const [game] = useGameContext()
  const [{ hours, minutes, seconds }, { start, stop, restart }] = useTimer()

  const remaining = countMinesAmount(game.playRows, game.mines)

  let time = `${padToTwoDigits(minutes)}:${padToTwoDigits(seconds)}`

  if (hours > 0) {
    time = padToTwoDigits(hours) + ':' + time
  }

  useEffect(() => {
    if (game.playState === Idle) restart()
    if (game.playState === Play) start()
    if ([Fail, Complete].includes(game.playState)) stop()
  }, [game, start, stop, restart])

  return (
    <Box justifyContent="center">
      {game.playState === Idle && <Text>Press &apos;space&apos; to start</Text>}
      {[Play, Fail].includes(game.playState) && (
        <Box gap={2}>
          <Text>Time: {time}</Text>
          <Text>|</Text>
          <Text>Remaining: {remaining}</Text>
          <Text>|</Text>
          <Text>Hint: {game.hintAmount}</Text>
        </Box>
      )}
      {game.playState === Complete && <Text>Usage Time: {time}</Text>}
    </Box>
  )
}

export default StatusBar

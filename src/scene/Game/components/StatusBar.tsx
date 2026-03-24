import { useEffect } from 'react'
import { Box, Text } from 'ink'
import useTheme from '@/hooks/useTheme'
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
  const { font, game: gameTheme } = useTheme()
  const [{ hours, minutes, seconds }, { start, stop, restart }] = useTimer()

  const { hint } = gameTheme
  const { textColor, accentColor, secondaryColor, foregroundColor } = font

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
    <Box height={1} alignItems="center" justifyContent="center">
      {game.playState === Idle && (
        <Box>
          <Text color={textColor}>Press </Text>
          <Text backgroundColor={foregroundColor} color={accentColor}>
            {' '}
            space{' '}
          </Text>
          <Text color={textColor}> to start</Text>
        </Box>
      )}

      {[Play, Fail].includes(game.playState) && (
        <Box gap={2}>
          <Box gap={1}>
            <Text backgroundColor={foregroundColor} color={accentColor}>
              {' '}
              Time{' '}
            </Text>
            <Text color={textColor}>{time}</Text>
          </Box>
          <Text>|</Text>
          <Box gap={1}>
            <Text backgroundColor={foregroundColor} color={secondaryColor}>
              {' '}
              Remaining{' '}
            </Text>
            <Text color={textColor}>{remaining}</Text>
          </Box>
          <Text>|</Text>
          <Box gap={1}>
            <Text backgroundColor={foregroundColor} color={hint}>
              {' '}
              Hint{' '}
            </Text>
            <Text color={textColor}>{game.hintAmount}</Text>
          </Box>
        </Box>
      )}

      {game.playState === Complete && (
        <Box gap={1}>
          <Text backgroundColor={foregroundColor} color={accentColor}>
            {' '}
            Usage Time{' '}
          </Text>
          <Text color={textColor}>{time}</Text>
        </Box>
      )}
    </Box>
  )
}

export default StatusBar

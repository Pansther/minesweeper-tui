import { useImmer } from 'use-immer'
import { Box, Text } from 'ink'
import { useKeybindings } from 'giggles'
import { clearStats, getStats } from '@/helpers/stats'
import { GameStatItem } from '@/helpers/type'
import useTheme from '@/hooks/useTheme'
import useStore from '@/store'
import { Scene } from '@/store/type'
import { secondsToHms } from '../Game/hooks/useTimer'
import { Difficulty } from '../Game/type'

const difficultyOptions = Object.values(Difficulty)
  .map((v) => v as Difficulty)
  .filter(Number)

const Statistics = ({ focus }: { focus: { id: string } }) => {
  const { font, game } = useTheme()
  const setScene = useStore((s) => s.setScene)

  const [state, setState] = useImmer({
    isReset: false,
    option: Difficulty.Easy,
  })

  const { dangers } = game
  const { accentColor, foregroundColor, textColor } = font

  const { overall, detail } = getStats()

  const navigate = (key: 'right' | 'left') => {
    setState((s) => {
      switch (key) {
        case 'left':
          if (s.option - 1 < difficultyOptions[0]) {
            s.option = difficultyOptions[difficultyOptions?.length - 1]
          } else {
            s.option -= 1
          }

          break
        case 'right':
          if (s.option + 1 > difficultyOptions.length) {
            s.option = difficultyOptions[0]
          } else {
            s.option += 1
          }

          break
      }
    })
  }

  const resetStats = () => {
    setState((s) => {
      s.isReset = true
    })
  }

  const confirmReset = () => {
    if (!state.isReset) return

    clearStats()
    setState((s) => {
      s.isReset = false
    })
  }

  useKeybindings(focus, {
    h: () => navigate('left'),
    left: () => navigate('left'),
    l: () => navigate('right'),
    right: () => navigate('right'),
    r: resetStats,
    y: confirmReset,
    n: () =>
      setState((s) => {
        s.isReset = false
      }),
    escape: () => setScene(Scene.Menu),
    q: () => setScene(Scene.Menu),
  })

  return (
    <Box
      width="100%"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
    >
      <Box marginBottom={1} height={1}>
        <Text backgroundColor={foregroundColor} color={accentColor}>
          {' '}
          Overall{' '}
        </Text>
      </Box>

      <Box width="100%" justifyContent="center">
        <Box
          width="50%"
          borderStyle="single"
          borderColor={accentColor}
          flexDirection="column"
        >
          <Stat {...overall} bestTime={Infinity} />
        </Box>
      </Box>

      <Box marginY={1} height={1}>
        <Box>
          <Text color={textColor}>Difficulty: </Text>
          <Text
            backgroundColor={foregroundColor}
            color={dangers?.[state.option]}
          >
            {' '}
            {Difficulty[state.option]}{' '}
          </Text>
        </Box>
      </Box>

      <Box width="100%" justifyContent="center">
        <Box
          width="50%"
          borderStyle="single"
          borderColor={accentColor}
          flexDirection="column"
        >
          <Stat {...detail[state.option]} />
        </Box>
      </Box>

      {state.isReset ? (
        <Box gap={1} marginTop={1}>
          <Text dimColor color={accentColor}>
            y
          </Text>
          <Text color={dangers[3]}>Confirm,</Text>

          <Text dimColor color={accentColor}>
            n
          </Text>
          <Text>Cancel</Text>
        </Box>
      ) : (
        <Box gap={1} marginTop={1}>
          <Text dimColor color={accentColor}>
            ←/h
          </Text>
          <Text>Left,</Text>

          <Text dimColor color={accentColor}>
            →/l
          </Text>
          <Text>Right,</Text>

          <Text dimColor color={accentColor}>
            r
          </Text>
          <Text>Reset Stats,</Text>

          <Text dimColor color={accentColor}>
            esc/q
          </Text>
          <Text>Back</Text>
        </Box>
      )}
    </Box>
  )
}

export default Statistics

const Stat = ({
  win,
  total,
  totalDuration,
  totalSafeCell,
  totalSafeCellOpened,
  mineFlagged,
  bestTime,
}: GameStatItem) => {
  const winRate = (win * 100) / (total || 1)
  const explorationRate = (totalSafeCellOpened * 100) / (totalSafeCell || 1)
  const averageTime = win ? totalDuration / win : 0
  const totalDurationHms = secondsToHms(totalDuration)
  const averageTimeHms = secondsToHms(averageTime)
  const bestTimeHms = secondsToHms(bestTime)

  return (
    <>
      <Item label="Games Played" value={total?.toLocaleString()} />
      <Item label="Won" value={win?.toLocaleString()} />
      {bestTime !== Infinity && (
        <Item
          label="Best Time"
          value={`${bestTimeHms?.hours} Hours ${bestTimeHms?.minutes} Minutes ${bestTimeHms?.seconds} Seconds`}
        />
      )}
      <Item label="Win Rate" value={`${winRate.toFixed(2)}%`} />
      <Item label="Exploration Rate" value={`${explorationRate.toFixed(2)}%`} />
      <Item
        label="Average Time"
        value={`${averageTimeHms?.hours} Hours ${averageTimeHms?.minutes} Minutes ${averageTimeHms?.seconds} Seconds`}
      />
      <Item
        label="Total Mines Disarmed"
        value={mineFlagged?.toLocaleString()}
      />
      <Item
        label="Total Duration"
        value={`${totalDurationHms?.hours} Hours ${totalDurationHms?.minutes} Minutes ${totalDurationHms?.seconds} Seconds`}
      />
    </>
  )
}

const Item = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <Box justifyContent="space-between">
      <Text>{label}: </Text>
      <Text>{value}</Text>
    </Box>
  )
}

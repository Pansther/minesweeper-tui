import cx from 'clsx'
import { useImmer } from 'use-immer'
import { Box, Text } from 'ink'
import { useKeybindings } from 'giggles'
import useTheme from '@/hooks/useTheme'
import useStore from '@/store'
import { Scene } from '@/store/type'
import { Difficulty } from '../Game/type'

const difficultyOptions = Object.values(Difficulty)
  .map((v) => v as Difficulty)
  .filter(Number)

const Settings = ({ focus }: { focus: { id: string } }) => {
  const { font } = useTheme()
  const setScene = useStore((s) => s.setScene)
  const difficulty = useStore((s) => s.difficulty)
  const setDifficulty = useStore((s) => s.setDifficulty)

  const [state, setState] = useImmer({
    option: difficulty,
    setting: 'difficulty',
  })

  const isSelectDifficulty = state.setting === 'difficulty'
  const { foregroundColor, accentColor, secondaryColor, textColor } = font

  const navigate = (key: 'right' | 'left') => {
    if (state.setting === 'difficulty') {
      setState((s) => {
        let option = s.option - 1

        switch (key) {
          case 'left':
            if (s.option - 1 < difficultyOptions[0]) {
              option = difficultyOptions[difficultyOptions?.length - 1]
            } else {
              option = s.option - 1
            }

            break
          case 'right':
            if (s.option + 1 > difficultyOptions.length) {
              option = difficultyOptions[0]
            } else {
              option = s.option + 1
            }

            break
        }

        s.option = option
        setDifficulty(option)
      })
    }
  }

  useKeybindings(focus, {
    h: () => navigate('left'),
    left: () => navigate('left'),
    l: () => navigate('right'),
    right: () => navigate('right'),
    escape: () => setScene(Scene.Menu),
    q: () => setScene(Scene.Menu),
  })

  return (
    <Box
      width="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box gap={2} marginBottom={4}>
        <Text
          color={accentColor}
          backgroundColor={cx({
            [foregroundColor]: isSelectDifficulty,
          })}
        >
          {' '}
          Difficulty{' '}
        </Text>

        <Box>
          {difficultyOptions.map((v) => {
            const isSelected = isSelectDifficulty && v === state.option

            return (
              <Text
                key={v}
                color={difficulty === v ? secondaryColor : textColor}
                backgroundColor={cx({ [foregroundColor]: isSelected })}
              >
                {' '}
                {Difficulty[v]}{' '}
              </Text>
            )
          })}
        </Box>
      </Box>

      <Box gap={1}>
        <Text dimColor color={accentColor}>
          esc/q
        </Text>
        <Text>Back</Text>
      </Box>
    </Box>
  )
}

export default Settings

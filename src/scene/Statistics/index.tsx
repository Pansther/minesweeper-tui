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

const Statistics = ({ focus }: { focus: { id: string } }) => {
  const { font } = useTheme()
  const setScene = useStore((s) => s.setScene)
  const difficulty = useStore((s) => s.difficulty)
  const setDifficulty = useStore((s) => s.setDifficulty)

  const [state, setState] = useImmer({
    items: [],
    setting: 'difficulty',
  })

  const isSelectDifficulty = state.setting === 'difficulty'
  const { foregroundColor, accentColor, secondaryColor, textColor } = font

  return (
    <Box
      width="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box></Box>
    </Box>
  )
}

export default Statistics

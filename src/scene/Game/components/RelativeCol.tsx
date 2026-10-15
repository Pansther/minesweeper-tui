import { Box, Text } from 'ink'
import useTheme from '@/hooks/useTheme'
import useStore from '@/store'
import useGameContext from '../context'

interface RelativeColProps {
  rowIndex: number
}

const RelativeCol = ({ rowIndex }: RelativeColProps) => {
  const { font } = useTheme()
  const { isRelativeLine } = useStore()
  const [{ selectedIndex }] = useGameContext()

  const { accentColor } = font

  return (
    <Box marginRight={2}>
      <Text color={accentColor} dimColor={rowIndex !== selectedIndex.row}>
        {isRelativeLine
          ? Math.abs(rowIndex - selectedIndex.row) || rowIndex + 1
          : rowIndex + 1}
      </Text>
    </Box>
  )
}

export default RelativeCol

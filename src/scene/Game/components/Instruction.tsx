import { useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import { useKeybindingRegistry } from 'giggles'
import useTheme from '@/hooks/useTheme'
import useStore from '@/store'
import { AvailableTheme } from '@/store/type'

const Instruction = () => {
  const { font } = useTheme()
  const theme = useStore((s) => s.theme)
  const registry = useKeybindingRegistry()
  const isShowKey = useStore((s) => s.isShowKey)

  const [isShowThemeNoti, setShowThemeNoti] = useState(false)

  const { textColor, accentColor, foregroundColor } = font

  const key = registry.available.reduce((prev, cmd) => {
    const name = cmd?.name as string
    const prevKey = prev?.[name] ?? []

    return { ...prev, [name]: [...prevKey, cmd.key.replace(' ', 'space')] }
  }, {} as Record<string, string[]>)

  useEffect(() => {
    setShowThemeNoti(true)

    const timeout = setTimeout(() => {
      setShowThemeNoti(false)
    }, 3_000)

    return () => {
      clearTimeout(timeout)
    }
  }, [theme])

  return (
    <Box justifyContent="space-between">
      <Box gap={0} flexWrap="wrap">
        {isShowKey &&
          Object.entries(key).map(([name, keys]) => (
            <Box key={name} gap={1}>
              <Text dimColor color={accentColor}>
                {keys.join('/')}
              </Text>
              <Text dimColor color={textColor}>
                {name},{' '}
              </Text>
            </Box>
          ))}

        {!isShowKey && (
          <Box gap={1}>
            <Text color={accentColor}>?</Text>
            <Text dimColor color={textColor}>
              Show Keys
            </Text>
          </Box>
        )}
      </Box>

      {isShowThemeNoti && (
        <Box
          height={isShowKey ? 2 : 1}
          flexDirection={isShowKey ? 'column' : 'row'}
          alignItems={isShowKey ? 'flex-end' : 'center'}
        >
          <Text color={accentColor} backgroundColor={foregroundColor}>
            {' '}
            Theme #{theme}{' '}
          </Text>
          <Text color={accentColor}> {AvailableTheme[theme]}</Text>
        </Box>
      )}
    </Box>
  )
}

export default Instruction

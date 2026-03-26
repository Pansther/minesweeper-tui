import { useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import useTheme from '@/hooks/useTheme'
import useStore from '@/store'
import { AvailableTheme } from '@/store/type'

const keys = [
  {
    key: '←/h',
    label: 'left',
  },
  {
    key: '↓/j',
    label: 'down',
  },
  {
    key: '↑/k',
    label: 'up',
  },
  {
    key: '→/l',
    label: 'right',
  },
  {
    key: '0',
    label: 'start',
  },
  {
    key: '$',
    label: 'end',
  },
  {
    key: 'g',
    label: 'top',
  },
  {
    key: 'G',
    label: 'bottom',
  },
  {
    key: 'M',
    label: 'center',
  },
  {
    key: 'space',
    label: 'open',
  },
  {
    key: 'f',
    label: 'flag',
  },
  {
    key: 'backspace',
    label: 'hint',
  },
  {
    key: '</>',
    label: 'cycle theme',
  },
  {
    key: 'r',
    label: 'restart',
  },
  {
    key: '?',
    label: 'hide keys',
  },
  {
    key: 'Q',
    label: 'exit',
  },
] as const

const Instruction = () => {
  const { font } = useTheme()
  const theme = useStore((s) => s.theme)
  const isShowKey = useStore((s) => s.isShowKey)

  const [isShowThemeNoti, setShowThemeNoti] = useState(false)

  const { textColor, accentColor, foregroundColor } = font

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
          keys.map(({ key, label }) => (
            <Box key={key} gap={1}>
              <Text dimColor color={accentColor}>
                {key}
              </Text>
              <Text dimColor color={textColor}>
                {label},{' '}
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

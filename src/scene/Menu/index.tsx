import cx from 'clsx'
import { useState } from 'react'
import { Box, Text } from 'ink'
import { useKeybindings } from 'giggles'
import useTheme from '@/hooks/useTheme'
import useStore from '@/store'
import { Scene } from '@/store/type'

const menuItems = [
  { label: 'New Game', value: Scene.Game },
  { label: 'Settings', value: Scene.Setting },
  { label: 'Quit', value: Scene.Quit },
]

const Menu = ({ focus }: { focus: { id: string } }) => {
  const { font } = useTheme()
  const setScene = useStore((s) => s.setScene)

  const [choice, setChoice] = useState(Scene.Game)

  const { foregroundColor, accentColor, textColor } = font

  const onSubmit = () => {
    if (choice === Scene.Quit) {
      process.exit()
    }

    setScene(choice)
  }

  const navigate = (key: 'up' | 'down') => {
    switch (key) {
      case 'up':
        setChoice((prev) =>
          prev - 1 < menuItems[0].value
            ? menuItems[menuItems?.length - 1].value
            : prev - 1,
        )
        break
      case 'down':
        setChoice((prev) =>
          prev + 1 > menuItems.length ? menuItems[0].value : prev + 1,
        )
        break
    }
  }

  useKeybindings(focus, {
    j: () => navigate('down'),
    down: () => navigate('down'),
    up: () => navigate('up'),
    k: () => navigate('up'),
    enter: onSubmit,
  })

  return (
    <Box
      gap={3}
      width="100%"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
    >
      <Text>
        {`
▗▖  ▗▖▗▄▄▄▖▗▖  ▗▖▗▄▄▄▖ ▗▄▄▖▗▖ ▗▖▗▄▄▄▖▗▄▄▄▖▗▄▄▖ ▗▄▄▄▖▗▄▄▖     ▗▄▄▄▖▗▖ ▗▖▗▄▄▄▖
▐▛▚▞▜▌  █  ▐▛▚▖▐▌▐▌   ▐▌   ▐▌ ▐▌▐▌   ▐▌   ▐▌ ▐▌▐▌   ▐▌ ▐▌      █  ▐▌ ▐▌  █
▐▌  ▐▌  █  ▐▌ ▝▜▌▐▛▀▀▘ ▝▀▚▖▐▌ ▐▌▐▛▀▀▘▐▛▀▀▘▐▛▀▘ ▐▛▀▀▘▐▛▀▚▖      █  ▐▌ ▐▌  █
▐▌  ▐▌▗▄█▄▖▐▌  ▐▌▐▙▄▄▖▗▄▄▞▘▐▙█▟▌▐▙▄▄▖▐▙▄▄▖▐▌   ▐▙▄▄▖▐▌ ▐▌      █  ▝▚▄▞▘▗▄█▄▖`}
      </Text>

      <Box flexDirection="column">
        {menuItems.map(({ label, value }) => {
          const isSelected = value === choice

          return (
            <Box key={value} justifyContent="center">
              <Text
                color={isSelected ? accentColor : textColor}
                backgroundColor={cx({ [foregroundColor]: isSelected })}
              >
                {' '}
                {label}{' '}
              </Text>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default Menu

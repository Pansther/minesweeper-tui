import cx from 'clsx'
import { useImmer } from 'use-immer'
import data from "@/../package.json" with { type: "json" };
import { Box, Text } from 'ink'
import { useKeybindings } from 'giggles'
import { getGameSave } from '@/helpers/game'
import useTheme from '@/hooks/useTheme'
import useStore from '@/store'
import { Scene } from '@/store/type'

const menuItems = [
  { label: 'Resume', scene: Scene.GameResume, value: 1, disabled: false },
  { label: 'New Game', scene: Scene.Game, value: 2, disabled: false },
  { label: 'Statistics', scene: Scene.Statistics, value: 3, disabled: false },
  { label: 'Settings', scene: Scene.Setting, value: 4, disabled: false },
  { label: 'Quit', scene: Scene.Quit, value: 5, disabled: false },
]

const getInitState = () => {
  const gameSave = getGameSave()
  const items = menuItems.map((item) => ({ ...item }))
  let choice = menuItems[0].value

  if (!gameSave || !gameSave?.playRows?.length) {
    items[0].disabled = true
    choice = menuItems[1].value
  }

  return {
    items,
    choice,
  }
}

const Menu = ({ focus }: { focus: { id: string } }) => {
  const { font } = useTheme()
  const setScene = useStore((s) => s.setScene)

  const [state, setState] = useImmer(getInitState())

  const { foregroundColor, accentColor, textColor } = font

  const onSubmit = () => {
    const item = state.items.find(({ value }) => value === state.choice)

    if (!item || item?.disabled) return

    if (item.scene === Scene.Quit) {
      process.exit()
    }

    setScene(item.scene)
  }

  const navigate = (key: 'up' | 'down') => {
    switch (key) {
      case 'up':
        setState((s) => {
          s.choice =
            s.choice - 1 < s.items[0].value
              ? s.items[s.items?.length - 1].value
              : s.choice - 1
        })
        break
      case 'down':
        setState((s) => {
          s.choice =
            s.choice + 1 > s.items.length ? s.items[0].value : s.choice + 1
        })
        break
    }
  }

  useKeybindings(focus, {
    j: () => navigate('down'),
    down: () => navigate('down'),
    k: () => navigate('up'),
    up: () => navigate('up'),
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
      <Box gap={4} alignItems="flex-end">
        <Text color={accentColor}>
          {`
▗▖  ▗▖▗▄▄▄▖▗▖  ▗▖▗▄▄▄▖ ▗▄▄▖▗▖ ▗▖▗▄▄▄▖▗▄▄▄▖▗▄▄▖ ▗▄▄▄▖▗▄▄▖
▐▛▚▞▜▌  █  ▐▛▚▖▐▌▐▌   ▐▌   ▐▌ ▐▌▐▌   ▐▌   ▐▌ ▐▌▐▌   ▐▌ ▐▌
▐▌  ▐▌  █  ▐▌ ▝▜▌▐▛▀▀▘ ▝▀▚▖▐▌ ▐▌▐▛▀▀▘▐▛▀▀▘▐▛▀▘ ▐▛▀▀▘▐▛▀▚▖
▐▌  ▐▌▗▄█▄▖▐▌  ▐▌▐▙▄▄▖▗▄▄▞▘▐▙█▟▌▐▙▄▄▖▐▙▄▄▖▐▌   ▐▙▄▄▖▐▌ ▐▌`}
        </Text>
        <Text color={textColor}>
          {`
▗▄▄▄▖▗▖ ▗▖▗▄▄▄▖
  █  ▐▌ ▐▌  █
  █  ▐▌ ▐▌  █
  █  ▝▚▄▞▘▗▄█▄▖`}
        </Text>
        <Text>v{data?.version}</Text>
      </Box>

      <Box flexDirection="column">
        {state.items?.map(({ label, value, disabled }) => {
          const isSelected = value === state.choice

          return (
            <Box key={value} justifyContent="center">
              <Text
                dimColor={disabled}
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

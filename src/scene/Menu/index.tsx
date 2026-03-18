import { useState } from 'react'
import { Box, Text } from 'ink'
import { Select } from 'giggles/ui'
import useStore from '@/store'
import { Scene } from '@/store/type'

const menuItems = [
  { label: 'New Game', value: Scene.Game },
  { label: 'Settings', value: Scene.Setting },
  { label: 'Quit', value: Scene.Quit },
]

const Menu = () => {
  const [choice, setChoice] = useState(Scene.Game)

  const setScene = useStore((s) => s.setScene)

  const onSubmit = (scene: Scene) => {
    if (scene === Scene.Quit) {
      process.exit()
    }

    setScene(scene)
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>Minesweeper TUI</Text>
      <Select
        value={choice}
        options={menuItems}
        onChange={setChoice}
        onSubmit={onSubmit}
      />
    </Box>
  )
}

export default Menu

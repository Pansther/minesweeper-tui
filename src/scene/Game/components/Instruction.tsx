import { Box, Text } from 'ink'
import { useKeybindingRegistry } from 'giggles'

const Instruction = () => {
  const registry = useKeybindingRegistry()

  const key = registry.available.reduce((prev, cmd) => {
    const name = cmd?.name as string
    const prevKey = prev?.[name] ?? []

    return { ...prev, [name]: [...prevKey, cmd.key] }
  }, {} as Record<string, string[]>)

  return (
    <Box gap={0} flexWrap="wrap">
      {Object.entries(key).map(([name, keys]) => (
        <Box key={name} gap={1}>
          <Text color="cyan">{keys.join('/')}</Text>
          <Text>{name}, </Text>
        </Box>
      ))}
    </Box>
  )
}

export default Instruction

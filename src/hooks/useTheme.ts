import useStore from '@/store'
import { themes, themesGame } from '@/store/config'

const useTheme = () => {
  const theme = useStore((s) => s.theme)
  const cycleTheme = useStore((s) => s.cycleTheme)

  return {
    font: themes[theme],
    game: themesGame[theme],
    cycleTheme,
  }
}

export default useTheme

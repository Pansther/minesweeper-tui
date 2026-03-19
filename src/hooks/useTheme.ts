import useStore from '@/store'
import { themes, themesGame } from '@/store/config'

const useTheme = () => {
  const theme = useStore((s) => s.theme)

  return {
    font: themes[theme],
    game: themesGame[theme],
  }
}

export default useTheme

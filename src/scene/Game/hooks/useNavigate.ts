import { useKeybindings } from 'giggles'
import useTheme from '@/hooks/useTheme'
import useStore from '@/store'
import { Scene } from '@/store/type'
import useGameContext from '../context'
import { GameState } from '../type'
import { AvailableNavigateKey } from './type'

const { Idle, Play } = GameState
const {
  Up,
  Down,
  Left,
  Right,
  CycleThemeLeft,
  CycleThemeRight,
  Top,
  Bottom,
  Start,
  End,
  Middle,
} = AvailableNavigateKey

const useNavigate = (focus: { id: string }) => {
  const { cycleTheme } = useTheme()
  const setScene = useStore((s) => s.setScene)
  const [{ restart }, setGame] = useGameContext()
  const toggleIsShowKey = useStore((s) => s.toggleIsShowKey)

  const navigate = (key: AvailableNavigateKey) => {
    switch (key) {
      case CycleThemeLeft:
        cycleTheme(-1)
        break
      case CycleThemeRight:
        cycleTheme(1)
        break
    }

    setGame((s) => {
      const isPlay = [Idle, Play].includes(s.playState)

      if (!isPlay) return

      switch (key) {
        case Up:
          if (s.selectedIndex.row <= 0) {
            s.selectedIndex.row = s.playRows[0].length - 1
          } else {
            s.selectedIndex.row -= 1
          }
          break
        case Down:
          s.selectedIndex.row += 1
          s.selectedIndex.row %= s.playRows[0].length
          break
        case Left:
          if (s.selectedIndex.col <= 0) {
            s.selectedIndex.col = s.playRows[1].length - 1
          } else {
            s.selectedIndex.col -= 1
          }
          break
        case Right:
          s.selectedIndex.col += 1
          s.selectedIndex.col %= s.playRows[1].length
          break
        case Top:
          s.selectedIndex.row = 0
          break
        case Bottom:
          s.selectedIndex.row = s.playRows.length - 1
          break
        case Start:
          s.selectedIndex.col = 0
          break
        case End:
          s.selectedIndex.col = s.playRows[s.selectedIndex.row].length - 1
          break
        case Middle:
          s.selectedIndex.row = Math.floor(s.playRows.length / 2)
          s.selectedIndex.col = Math.floor(s.playRows.length / 2)
          break
      }
    })
  }

  useKeybindings(focus, {
    j: { action: () => navigate(Down), name: 'Move Down' },
    down: { action: () => navigate(Down), name: 'Move Down' },
    k: { action: () => navigate(Up), name: 'Move Up' },
    up: { action: () => navigate(Up), name: 'Move Up' },
    h: { action: () => navigate(Left), name: 'Move Left' },
    left: { action: () => navigate(Left), name: 'Move Left' },
    l: { action: () => navigate(Right), name: 'Move Right' },
    right: { action: () => navigate(Right), name: 'Move Right' },
    '<': { action: () => navigate(CycleThemeLeft), name: 'CycleTheme' },
    '>': { action: () => navigate(CycleThemeRight), name: 'CycleTheme' },
    g: { action: () => navigate(Top), name: 'Top' },
    G: { action: () => navigate(Bottom), name: 'Bottom' },
    0: { action: () => navigate(Start), name: 'Start' },
    $: { action: () => navigate(End), name: 'End' },
    M: { action: () => navigate(Middle), name: 'Middle' },
    r: { action: restart, name: 'Restart' },
    '?': { action: toggleIsShowKey, name: 'Hide Keys' },
    Q: { action: () => setScene(Scene.Menu), name: 'Quit' },
  })
}

export default useNavigate

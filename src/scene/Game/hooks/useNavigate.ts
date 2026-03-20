import { useKeybindings } from 'giggles'
import useTheme from '@/hooks/useTheme'
import useGameContext from '../context'
import { AvailableNavigateKey } from './type'

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
  const [{ isPlay, restart }, setGame] = useGameContext()

  const navigate = (key: AvailableNavigateKey) => {
    if (!isPlay) return

    switch (key) {
      case Up:
        setGame((s) => {
          if (s.selectedIndex.row <= 0) {
            s.selectedIndex.row = s.playRows[0].length - 1
          } else {
            s.selectedIndex.row -= 1
          }
        })
        break
      case Down:
        setGame((s) => {
          s.selectedIndex.row += 1
          s.selectedIndex.row %= s.playRows[0].length
        })
        break
      case Left:
        setGame((s) => {
          if (s.selectedIndex.col <= 0) {
            s.selectedIndex.col = s.playRows[1].length - 1
          } else {
            s.selectedIndex.col -= 1
          }
        })
        break
      case Right:
        setGame((s) => {
          s.selectedIndex.col += 1
          s.selectedIndex.col %= s.playRows[1].length
        })
        break
      case CycleThemeLeft:
        cycleTheme(-1)
        break
      case CycleThemeRight:
        cycleTheme(1)
        break
      case Top:
        setGame((s) => {
          s.selectedIndex.row = 0
        })
        break
      case Bottom:
        setGame((s) => {
          s.selectedIndex.row = s.playRows.length - 1
        })
        break
      case Start:
        setGame((s) => {
          s.selectedIndex.col = 0
        })
        break
      case End:
        setGame((s) => {
          s.selectedIndex.col = s.playRows[s.selectedIndex.row].length - 1
        })
        break
      case Middle:
        setGame((s) => {
          s.selectedIndex.row = Math.floor(s.playRows.length / 2)
        })
        break
    }
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
  })
}

export default useNavigate

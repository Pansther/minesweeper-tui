import { useRef } from 'react'
import { useKeybindings } from 'giggles'
import { clearSaveGame, saveGame } from '@/helpers/game'
import useTheme from '@/hooks/useTheme'
import useStore from '@/store'
import { Scene } from '@/store/type'
import { StatusBarRef } from '../components/StatusBar'
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
  Forward,
  Backward,
} = AvailableNavigateKey

const useNavigate = ({
  ref,
  focus,
}: {
  focus: { id: string }
  ref?: React.RefObject<StatusBarRef | null>
}) => {
  const digitKeyRef = useRef('')

  const { cycleTheme } = useTheme()
  const setScene = useStore((s) => s.setScene)
  const toggleIsShowKey = useStore((s) => s.toggleIsShowKey)
  const toggleRelativeLine = useStore((s) => s.toggleRelativeLine)
  const [{ mines, playRows, playState, hintAmount, restart }, setGame] =
    useGameContext()

  const navigate = (key: AvailableNavigateKey) => {
    switch (key) {
      case CycleThemeLeft:
        cycleTheme(-1)
        break
      case CycleThemeRight:
        cycleTheme(1)
        break
    }

    const num = +digitKeyRef.current || 1

    setGame((s) => {
      const isPlay = [Idle, Play].includes(s.playState)

      if (!isPlay) return

      switch (key) {
        case Up:
          s.selectedIndex.row -= num
          if (s.selectedIndex.row <= 0) {
            s.selectedIndex.row = 0
          }
          break
        case Down:
          s.selectedIndex.row += num
          if (s.selectedIndex.row > s.playRows[0].length - 1) {
            s.selectedIndex.row = s.playRows[0].length - 1
          }
          break
        case Left:
          s.selectedIndex.col -= num
          if (s.selectedIndex.col <= 0) {
            s.selectedIndex.col = 0
          }
          break
        case Right:
          s.selectedIndex.col += num
          if (s.selectedIndex.col >= s.playRows[1].length - 1) {
            s.selectedIndex.col = s.playRows[1].length - 1
          }
          break
        case Top:
          s.selectedIndex.row = 0
          break
        case Bottom:
          if (num > 1) {
            s.selectedIndex.row =
              num > s.playRows.length ? s.playRows.length - 1 : num - 1
          } else {
            s.selectedIndex.row = s.playRows.length - 1
          }

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

        case Forward: {
          let isFound = false
          let row = s.selectedIndex.row
          let col = s.selectedIndex.col
          const type = s.playRows[row][col]

          while (!isFound) {
            col += 1

            if (s.playRows[row][col] !== type) {
              isFound = true
            }

            if (col >= s.playRows[row].length) {
              col = 0
              row += 1
            }

            if (row >= s.playRows.length) {
              row = s.playRows.length - 1
              col = s.playRows[row].length - 1
              isFound = true
            }

            s.selectedIndex.row = row
            s.selectedIndex.col = col
          }

          break
        }
        case Backward: {
          let isFound = false
          let row = s.selectedIndex.row
          let col = s.selectedIndex.col
          const type = s.playRows[row][col]

          while (!isFound) {
            col -= 1

            if (s.playRows[row][col] !== type) {
              isFound = true
            }

            if (col < 0) {
              col = s.playRows[row].length - 1
              row -= 1
            }

            if (row <= 0) {
              row = 0
              col = 0
              isFound = true
            }

            s.selectedIndex.row = row
            s.selectedIndex.col = col
          }

          break
        }
      }
    })

    digitKeyRef.current = ''
  }

  const saveAndQuit = () => {
    if (playState !== GameState.Play) {
      clearSaveGame()
    } else {
      saveGame({
        mines,
        playRows,
        hintAmount,
        initTime: ref?.current?.time ?? 0,
      })
    }

    setScene(Scene.Menu)
  }

  const regisDigitKey = (digit: string) => {
    if (digit === '0' && !digitKeyRef.current) {
      return navigate(Start)
    }

    digitKeyRef.current += digit
    digitKeyRef.current = digitKeyRef.current.slice(0, 3)
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
    $: { action: () => navigate(End), name: 'End' },
    M: { action: () => navigate(Middle), name: 'Middle' },
    w: { action: () => navigate(Forward), name: 'Forward' },
    b: { action: () => navigate(Backward), name: 'Backward' },
    r: { action: restart, name: 'Restart' },
    '?': { action: toggleIsShowKey, name: 'Hide Keys' },
    n: { action: toggleRelativeLine, name: 'Toggle Relative' },
    Q: { action: saveAndQuit, name: 'Quit' },
    ...digits.reduce(
      (prev, i) => ({ ...prev, [i]: { action: () => regisDigitKey(i + '') } }),
      {},
    ),
  })
}

export default useNavigate

const digits = Array.from({ length: 10 }).map((_, i) => i)

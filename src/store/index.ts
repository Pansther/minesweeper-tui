import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { Difficulty } from '@/scene/Game/type'
import { AvailableTheme, Scene } from './type'

export const DEFAULT_THEME = AvailableTheme.Catppuccin
const ALL_THEMES = Object.values(AvailableTheme).map((v) => Number(v))

interface Store {
  scene: Scene
  theme: AvailableTheme
  difficulty: Difficulty
  isShowKey: boolean
  setScene: (scene: Scene) => void
  cycleTheme: (amount: number) => void
  toggleIsShowKey: () => void
  setDifficulty: (difficulty: Difficulty) => void
}

const useStore = create(
  immer<Store>((set) => ({
    scene: Scene.Menu,
    theme: AvailableTheme.Catppuccin,
    difficulty: Difficulty.Medium,
    isShowKey: true,
    setScene(scene) {
      set((state) => {
        state.scene = scene
      })
    },
    cycleTheme: (amount = 1) =>
      set((s) => {
        const nextTheme = s.theme + amount

        if (nextTheme > ALL_THEMES[ALL_THEMES.length - 1]!) {
          s.theme = DEFAULT_THEME
        } else if (nextTheme < DEFAULT_THEME) {
          s.theme = ALL_THEMES[ALL_THEMES.length - 1]
        } else {
          s.theme = nextTheme
        }
      }),
    toggleIsShowKey: () =>
      set((s) => {
        s.isShowKey = !s.isShowKey
      }),
    setDifficulty: (difficulty) =>
      set((s) => {
        s.difficulty = difficulty
      }),
  })),
)

export default useStore

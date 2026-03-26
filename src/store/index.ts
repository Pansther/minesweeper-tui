import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { getConfig, saveConfig } from '@/helpers/file'
import { Config } from '@/helpers/type'
import { Difficulty } from '@/scene/Game/type'
import { AvailableTheme, Scene } from './type'

export const DEFAULT_THEME = AvailableTheme.Catppuccin
const ALL_THEMES = Object.values(AvailableTheme).map((v) => Number(v))

interface Store extends Config {
  scene: Scene
  setScene: (scene: Scene) => void
  cycleTheme: (amount: number) => void
  toggleIsShowKey: () => void
  setDifficulty: (difficulty: Difficulty) => void
}

const config = getConfig()

const useStore = create(
  immer<Store>((set, get) => ({
    scene: Scene.Menu,
    theme: config?.theme ?? AvailableTheme.Catppuccin,
    difficulty: config?.difficulty ?? Difficulty.Medium,
    isShowKey: config?.isShowKey ?? true,
    setScene(scene) {
      set((state) => {
        state.scene = scene
      })
    },
    cycleTheme: (amount = 1) => {
      let nextTheme = get().theme + amount

      if (nextTheme > ALL_THEMES[ALL_THEMES.length - 1]!) {
        nextTheme = DEFAULT_THEME
      } else if (nextTheme < DEFAULT_THEME) {
        nextTheme = ALL_THEMES[ALL_THEMES.length - 1]
      }

      saveConfig({ theme: nextTheme })

      return set((s) => {
        s.theme = nextTheme
      })
    },
    toggleIsShowKey: () => {
      saveConfig({ isShowKey: !get().isShowKey })

      return set((s) => {
        s.isShowKey = !s.isShowKey
      })
    },
    setDifficulty: (difficulty) => {
      saveConfig({ difficulty })

      return set((s) => {
        s.difficulty = difficulty
      })
    },
  })),
)

export default useStore

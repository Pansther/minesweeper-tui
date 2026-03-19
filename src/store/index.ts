import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { AvailableTheme, Scene } from './type'

interface Store {
  scene: Scene
  theme: AvailableTheme
  setScene: (scene: Scene) => void
}

const useStore = create(
  immer<Store>((set) => ({
    scene: Scene.Game,
    theme: AvailableTheme.Rosepine,
    setScene(scene) {
      set((state) => {
        state.scene = scene
      })
    },
  })),
)

export default useStore

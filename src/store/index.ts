import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { Scene } from './type'

interface Store {
  scene: Scene
  setScene: (scene: Scene) => void
}

const useStore = create(
  immer<Store>((set) => ({
    scene: Scene.Game,
    setScene(scene) {
      set((state) => {
        state.scene = scene
      })
    },
  })),
)

export default useStore

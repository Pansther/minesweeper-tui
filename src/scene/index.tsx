import Game from './Game'
import { GameContextProvider } from './Game/context'
import Menu from './Menu'
import useStore from '@/store'
import { Scene } from '@/store/type'

const SceneManager = () => {
  const scene = useStore((s) => s.scene)

  switch (scene) {
    case Scene.Game:
      return (
        <GameContextProvider>
          <Game />
        </GameContextProvider>
      )
    case Scene.Menu:
    default:
      return <Menu />
  }
}

export default SceneManager

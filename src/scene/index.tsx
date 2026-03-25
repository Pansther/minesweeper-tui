import { useFocusNode } from 'giggles'
import useStore from '@/store'
import { Scene } from '@/store/type'
import Game from './Game'
import { GameContextProvider } from './Game/context'
import Menu from './Menu'

const SceneManager = () => {
  const focus = useFocusNode()
  const scene = useStore((s) => s.scene)

  switch (scene) {
    case Scene.Game:
      return (
        <GameContextProvider>
          <Game focus={focus} />
        </GameContextProvider>
      )
    case Scene.Menu:
    default:
      return <Menu focus={focus} />
  }
}

export default SceneManager

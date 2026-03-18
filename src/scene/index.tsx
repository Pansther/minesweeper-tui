import useStore from '@/store'
import { Scene } from '@/store/type'
import Game from './Game'
import Menu from './Menu'

const SceneManager = () => {
  const scene = useStore((s) => s.scene)

  switch (scene) {
    case Scene.Game:
      return <Game />
    case Scene.Menu:
    default:
      return <Menu />
  }
}

export default SceneManager

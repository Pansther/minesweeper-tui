import { render } from 'ink'
import { GigglesProvider } from 'giggles'
import SceneManager from './scene'

function App() {
  return <SceneManager />
}

render(
  <GigglesProvider>
    <App />
  </GigglesProvider>,
)

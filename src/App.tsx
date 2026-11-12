import { Editor } from './screens/Editor'
import { GameDetail } from './screens/GameDetail'
import { Home } from './screens/Home'
import { Play } from './screens/Play'
import { Players } from './screens/Players'
import { Settings } from './screens/Settings'
import { useRoute } from './lib/router'

export function App() {
  const [screen, id] = useRoute()
  let view
  switch (screen) {
    case 'jugadores': view = <Players />; break
    case 'ajustes': view = <Settings />; break
    case 'juego': view = <GameDetail key={id} id={id} />; break
    case 'jugar': view = <Play key={id} id={id} />; break
    case 'editar': view = <Editor key={id} id={id} />; break
    default: view = <Home />
  }
  return <div className="app">{view}</div>
}

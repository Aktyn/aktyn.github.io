import { useContext, useEffect } from 'react'
import { ViewContext, ViewType } from '../../context/viewContext'

export function Websites() {
  const { view: currentView, scene } = useContext(ViewContext)

  useEffect(() => {
    if (!scene || currentView !== ViewType.WEBSITES) {
      return
    }

    // TODO: interactive gallery in THREEjs scene

    // const logo = new LogoEdges(scene.getScene())
    // scene.addObject(logo)

    return () => {
      // scene.removeObject(logo)
      // logo.destroy()
    }
  }, [currentView, scene])

  // return <div className="view-container">xyz</div>
  return null
}

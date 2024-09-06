import { useContext, useEffect } from 'react'
import { ViewContext, ViewType } from '../../context/viewContext'
import { ImagesGallery } from '../../scene-3D/objects/images-gallery'

/* eslint-disable @typescript-eslint/no-require-imports */
export function Websites() {
  const { view: currentView, scene } = useContext(ViewContext)

  useEffect(() => {
    if (!scene || currentView !== ViewType.WEBSITES) {
      return
    }

    const gallery = new ImagesGallery(scene.getScene(), [
      { source: require('../../img/websites/berta-snakes.webp'), color: 0xbbbbbb },
      require('../../img/websites/fivem-launcher.webp'),
      { source: require('../../img/websites/in2rp.webp'), color: 0xdddddd },
      { source: require('../../img/websites/map-poi.webp'), color: 0x999999 },
      require('../../img/websites/project-paradise.webp'),
    ])
    scene.addObject(gallery)

    return () => {
      //TODO: run exit animation before destroying
      scene.removeObject(gallery)
      gallery.destroy()
    }
  }, [currentView, scene])

  // return <div className="view-container">xyz</div>
  return null
}

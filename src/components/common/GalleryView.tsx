import { useContext, useEffect } from 'react'
import { ViewContext, type ViewType } from '../../context/viewContext'
import { ImagesGallery, type ImageSourceType } from '../../scene-3D/objects/images-gallery'

type GalleryViewProps = {
  view: ViewType
  images: Array<ImageSourceType>
}

export function GalleryView({ view, images }: GalleryViewProps) {
  const { view: currentView, scene } = useContext(ViewContext)

  useEffect(() => {
    if (!scene || currentView !== view) {
      return
    }

    const gallery = new ImagesGallery(scene.getScene(), images)
    scene.addObject(gallery)

    return () => {
      //TODO: run exit animation before destroying
      scene.removeObject(gallery)
      gallery.destroy()
    }
  }, [currentView, images, scene, view])

  return null
}

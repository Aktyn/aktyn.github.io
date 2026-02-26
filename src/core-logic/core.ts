import { type SceneObject } from "~/graphics/scene-object"
import { WebScene } from "~/graphics/web-scene"
import { LOGO_PATH } from "~/lib/consts"

enum View {
  Intro = "intro",
  MyJourney = "my-journey",
  PublicProjects = "public-projects",
  TechStack = "tech-stack",
}

export class Core {
  private readonly webScene: WebScene

  private readonly objects: SceneObject[] = []

  constructor(container: HTMLDivElement) {
    this.webScene = new WebScene(container)
    // const objects: SceneObject[] = []
    // Promise.all([
    //   scene.createTextObject("Aktyn", 40, "#001814"),
    //   Promise.resolve(scene.createSvgObject(LOGO_PATH, "#001814")),
    // ])
    //   .then((objects: SceneObject[]) => objects.push(...objects))
    //   .catch(console.error)

    this.setView(View.Intro)
  }

  dispose() {
    this.webScene.dispose()
  }

  private setView(view: View) {
    this.objects.push(this.webScene.createSvgObject(LOGO_PATH, "#001814"))
    this.webScene
      .createTextObject("Aktyn", 40, "#001814")
      .then((object) => {
        this.objects.push(object)
      })
      .catch(console.error)
  }
}

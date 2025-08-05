import type { PropsWithChildren } from "react"
import { createContext, useContext, useState } from "react"

enum View {
  Intro = "intro",
  PublicProjects = "public-projects",
  MyJourney = "my-journey",
  TechStack = "tech-stack",
}

const ViewsArray = Object.values(View)

const ViewContext = createContext({
  view: View.Intro,
  setView: (_view: View) => {},
})

function ViewProvider({ children }: PropsWithChildren) {
  const viewFromHash =
    ((window.location.hash?.replace(/^#(.*)/, "$1") ?? "") as View) || ""

  const [view, setView] = useState(
    viewFromHash
      ? ViewsArray.includes(viewFromHash)
        ? (viewFromHash as View)
        : View.Intro
      : View.Intro,
  )

  return <ViewContext value={{ view, setView }}>{children}</ViewContext>
}

function useView() {
  return useContext(ViewContext)
}

const viewData = {
  [View.Intro]: { title: "", extendedTitle: "" },
  [View.PublicProjects]: {
    title: "Projects",
    extendedTitle: "Explore my noncommercial projects",
  },
  [View.MyJourney]: {
    title: "Experience",
    extendedTitle: "My journey in the software world",
  },
  [View.TechStack]: {
    title: "Tech stack",
    extendedTitle: "See my skills stack for more technical info",
  },
} as const satisfies { [key in View]: object }

export const ViewModule = {
  View,
  ViewsArray,
  viewData,
  Provider: ViewProvider,
  useView,
}

type ViewEnum = View

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ViewModule {
  export type View = ViewEnum[keyof ViewEnum]
}

import type { PropsWithChildren } from "react"
import { createContext, useContext, useState } from "react"

enum View {
  Intro = "intro",
  PublicProjects = "public-projects",
  MyJourney = "my-journey",
  TechStack = "tech-stack", //TODO - groups: web development, backend development, databases, known tools
}

const ViewsArray = Object.values(View)

const ViewContext = createContext({
  view: View.Intro,
  setView: (_view: View) => {},
})

function ViewProvider({ children }: PropsWithChildren) {
  const [view, setView] = useState(View.Intro)

  return <ViewContext value={{ view, setView }}>{children}</ViewContext>
}

function useView() {
  return useContext(ViewContext)
}

const viewData = {
  [View.Intro]: { extendedTitle: "" },
  [View.PublicProjects]: {
    extendedTitle: "Explore my noncommercial projects",
  },
  [View.MyJourney]: { extendedTitle: "Take a look at my journey" },
  [View.TechStack]: {
    extendedTitle: "See my skills stack for more technical details",
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

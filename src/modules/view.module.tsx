import type { PropsWithChildren } from "react"
import { useCallback } from "react"
import { createContext, useContext, useState } from "react"
import { clamp } from "~/lib/utils"

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
  viewChangeDirection: 0,
})

function ViewProvider({ children }: PropsWithChildren) {
  const viewFromHash =
    ((window.location.hash?.replace(/^#(.*)/, "$1") ?? "") as View) || ""

  const [view, setViewInternal] = useState(
    viewFromHash
      ? ViewsArray.includes(viewFromHash)
        ? (viewFromHash as View)
        : View.Intro
      : View.Intro,
  )
  const [viewChangeDirection, setViewChangeDirection] = useState(0)

  const setView = useCallback((newView: View) => {
    setViewInternal((currentView) => {
      if (currentView === newView) {
        return currentView
      }

      setViewChangeDirection(
        clamp(
          ViewsArray.indexOf(newView) - ViewsArray.indexOf(currentView),
          -1,
          1,
        ),
      )
      return newView
    })
  }, [])

  return (
    <ViewContext value={{ view, setView, viewChangeDirection }}>
      {children}
    </ViewContext>
  )
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

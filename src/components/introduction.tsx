import { differenceInYears, format } from "date-fns"
import { CalendarRange } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

import "./introduction.css"

const experienceStartDate = new Date("2019-10-10")
const fullName = "Radosław Krajewski"
const role = "Frontend Developer"

export function Introduction() {
  return (
    <div className="min-h-[calc(50dvh-var(--spacing)*6)] flex flex-col justify-end items-center gap-y-2 pb-4">
      <div
        className="full-name-container relative *:text-5xl *:font-black *:leading-snug *:tracking-wider *:not-last:absolute *:not-last:inset-0 *:not-last:select-none *:not-last:pointer-events-none"
        onAnimationEnd={(event) =>
          event.currentTarget.classList.add("scroll-based-animation")
        }
      >
        <div className="bg-linear-90 from-[oklch(63.92%_0.2104_5.28)] to-[oklch(84.33%_0.1606_165.37)] bg-clip-text text-transparent blur-2xl -z-1 opacity-70 animate-in fade-in delay-600 duration-500 fill-mode-both">
          {fullName}
        </div>
        <h2 className="text-white drop-shadow-[0_0_calc(var(--spacing)*0.5)_#000] mix-blend-soft-light">
          {fullName}
        </h2>
      </div>
      <div
        className="role-container inline-flex flex-col items-center gap-y-2"
        onAnimationEnd={(event) =>
          event.currentTarget.classList.add("scroll-based-animation")
        }
      >
        <h3 className="text-3xl font-medium pt-4 tracking-wide">{role}</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-x-2">
              <CalendarRange className="size-5" />
              {differenceInYears(new Date(), experienceStartDate)} years of
              experience
            </p>
          </TooltipTrigger>
          <TooltipContent className="text-sm">
            <b>{format(experienceStartDate, "dd.MM.yyyy")}</b> till now
          </TooltipContent>
        </Tooltip>
      </div>
      {/* TODO: button that opens popup or modal with my experience timeline */}
    </div>
  )
}

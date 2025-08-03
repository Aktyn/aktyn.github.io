import { differenceInYears, format } from "date-fns"
import { CalendarHeart, CalendarRange, Map, MapPinHouse } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip.tsx"
import type { ComponentProps } from "react"
import { cn } from "~/lib/utils.ts"
import { Button } from "~/components/ui/button.tsx"

const experienceStartDate = new Date("2019-10-10")
const fullName = "Radosław Krajewski"
const role = "Frontend Developer"

export function Introduction() {
  return (
    <div className="flex flex-col justify-end items-center gap-y-2 pb-4 w-full max-w-full text-center backdrop-hue-rotate-0">
      <div
        className="relative *:text-5xl *:font-black *:leading-snug *:tracking-wider *:not-last:absolute *:not-last:inset-0 *:not-last:select-none *:not-last:pointer-events-none"
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
        className="w-full flex flex-col items-center gap-y-2"
        onAnimationEnd={(event) =>
          event.currentTarget.classList.add("scroll-based-animation")
        }
      >
        <h3 className="text-3xl font-medium pt-4 tracking-wide">{role}</h3>
        <QuickPersonalInfo />
      </div>
    </div>
  )
}

function QuickPersonalInfo() {
  return (
    <div className="w-2xl! max-w-full flex flex-row flex-wrap *:flex-1 items-center justify-start gap-x-8">
      <QuickInfoLabel>
        <MapPinHouse />
        <span>Poland, Łódź</span>
        <Button
          asChild
          variant="link"
          size="sm"
          className="text-xs text-muted-foreground hover:text-primary hover:no-underline px-1!"
        >
          <a
            href="https://maps.app.goo.gl/HngK9DdmwfTJpXhA9"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Map className="inline size-4" />
            Show
          </a>
        </Button>
      </QuickInfoLabel>
      <Tooltip>
        <TooltipTrigger asChild>
          <QuickInfoLabel>
            <CalendarRange />
            <span>
              {differenceInYears(new Date(), experienceStartDate)} years in the
              business
            </span>
          </QuickInfoLabel>
        </TooltipTrigger>
        <TooltipContent className="text-sm">
          <b>{format(experienceStartDate, "dd.MM.yyyy")}</b> till now
        </TooltipContent>
      </Tooltip>
      <QuickInfoLabel>
        <CalendarHeart />
        <span>{calculateAge(new Date("1996-02-14"))} years old</span>
      </QuickInfoLabel>
    </div>
  )
}

function QuickInfoLabel(props: ComponentProps<"p">) {
  return (
    <p
      {...props}
      className={cn(
        "text-sm text-muted-foreground font-medium flex items-center justify-center gap-x-2 whitespace-nowrap *:[svg]:min-w-5 *:[svg]:size-5 *:[svg]:aspect-square",
        props.className,
      )}
    />
  )
}

function calculateAge(birthDate: Date) {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

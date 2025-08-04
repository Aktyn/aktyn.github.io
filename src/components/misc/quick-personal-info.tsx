import { differenceInYears, format } from "date-fns"
import { CalendarHeart, CalendarRange, Map, MapPinHouse } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import type { ComponentProps } from "react"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"

export function QuickPersonalInfo({
  experienceStartDate,
}: {
  experienceStartDate: Date
}) {
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

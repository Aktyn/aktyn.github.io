import type { ElementType } from "react"
import { GithubProjectLink } from "~/components/common/github-project-link"
import { cn } from "~/lib/utils"

type QuickProjectInfoProps = {
  component?: ElementType
  className?: string
  title: string
  description?: string
  githubLink: `https://github.com/${string}`
}

export function QuickProjectInfo({
  component,
  className,
  title,
  description,
  githubLink,
}: QuickProjectInfoProps) {
  const Comp = component ?? "div"

  return (
    <Comp className={cn("text-balance leading-none my-0.5", className)}>
      <GithubProjectLink
        href={githubLink}
        title={title}
        className="font-medium"
      />
      {description && (
        <span className="text-xs text-muted-foreground whitespace-pre-wrap">
          {" "}
          - {description}
        </span>
      )}
    </Comp>
  )
}

import { ExternalLink } from "lucide-react"
import type { ComponentProps } from "react"
import { cn } from "~/lib/utils"
import { GithubIcon } from "../icons/GithubIcon"

type GithubProjectLinkProps = ComponentProps<"a"> & {
  title: string
}

export function GithubProjectLink({
  title,
  ...aProps
}: GithubProjectLinkProps) {
  return (
    <a
      target="_blank"
      {...aProps}
      className={cn(
        "font-semibold inline hover:*:*:[svg]:last:opacity-100 hover:*:*:[svg]:last:scale-100 hover:*:*:[svg]:first:opacity-0 hover:*:*:[svg]:first:scale-golden-inverse",
        aProps.className,
      )}
    >
      <span className="relative inline-flex flex-row items-center justify-center *:[svg]:size-3 *:[svg]:transition-[opacity,scale]">
        <GithubIcon />
        <ExternalLink className="absolute inset-0 opacity-0 scale-golden-inverse" />
      </span>{" "}
      <span className="underline">{title}</span>
    </a>
  )
}

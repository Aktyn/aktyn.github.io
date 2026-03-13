import type { ElementType } from 'react'
import { GithubProjectLink } from '~/components/common/github-project-link'
import { cn } from '~/lib/utils'

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
  const Comp = component ?? 'div'

  //TODO: refine

  return (
    <Comp className={cn('my-0.5 leading-none text-balance', className)}>
      <GithubProjectLink href={githubLink} title={title} className="font-medium" />
      {description && (
        <span className="text-xs whitespace-pre-wrap text-muted-foreground"> - {description}</span>
      )}
    </Comp>
  )
}

import type { ComponentProps } from 'react'
import { cn } from '~/lib/utils'
import { GithubIcon } from '../../icons/GithubIcon'
import { SvgIcon } from '~/icons/material-symbol-icons'

type GithubProjectLinkProps = ComponentProps<'a'> & {
  title: string
}

export function GithubProjectLink({ title, ...anchorProps }: GithubProjectLinkProps) {
  return (
    <a
      target="_blank"
      {...anchorProps}
      className={cn(
        'inline font-semibold hover:*:*:[svg]:first:scale-golden-inverse hover:*:*:[svg]:first:opacity-0 hover:*:*:[svg]:last:scale-100 hover:*:*:[svg]:last:opacity-100',
        anchorProps.className,
      )}
    >
      <span className="relative inline-flex flex-row items-center justify-center *:[svg]:size-3 *:[svg]:transition-[opacity,scale]">
        <GithubIcon />
        <SvgIcon icon="OpenInNew" className="absolute inset-0 scale-golden-inverse opacity-0" />
      </span>{' '}
      <span className="underline">{title}</span>
    </a>
  )
}

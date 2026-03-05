import { GithubIcon } from '~/icons/GithubIcon'
import { LinkedInIcon } from '~/icons/LinkedInIcon'
import type { ComponentProps } from 'react'
import { cn } from '~/lib/utils'
import { materialSymbolIcons, materialSymbolProps } from '~/icons/material-symbol-icons'

export function SocialLinks(props: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'mx-auto grid w-full grid-cols-[repeat(auto-fit,calc(var(--spacing)*32))] items-start justify-center gap-x-3 gap-y-2',
        props.className,
      )}
    >
      <SocialLinkButton href="https://github.com/aktyn">
        <GithubIcon />
        GitHub
      </SocialLinkButton>
      <SocialLinkButton href="https://www.linkedin.com/in/aktyn">
        <LinkedInIcon />
        LinkedIn
      </SocialLinkButton>
    </div>
  )
}

type SocialLinkButtonProps = ComponentProps<'a'> & { href: string }

function SocialLinkButton({ children, className, href, ...linkProps }: SocialLinkButtonProps) {
  //TODO: project rounded shape for light ray casting
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...linkProps}
      className={cn(
        'relative inline-flex flex-row items-center justify-center gap-2 overflow-hidden rounded-full border bg-background-lighter/50 p-1 font-bold whitespace-nowrap text-foreground backdrop-blur-sm transition-colors hover:bg-border hover:text-foreground-lighter',
        '*:transition-[opacity,scale] hover:*:first:opacity-0 hover:*:last:scale-100 hover:*:last:opacity-100',
        className,
      )}
    >
      <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap *:[svg]:size-5">
        {children}
      </div>
      {/* <ExternalLink className="text-primary pointer-events-none absolute inset-auto scale-0 opacity-0" /> */}
      <div className="absolute inset-0 flex scale-0 items-center justify-center opacity-0">
        <svg
          viewBox={materialSymbolProps.viewBox}
          className="inline-block size-4.5 fill-foreground-lighter"
        >
          <path d={materialSymbolIcons.OpenInNew} />
        </svg>
      </div>
    </a>
  )
}

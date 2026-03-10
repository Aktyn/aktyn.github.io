import type { ComponentProps, ComponentPropsWithoutRef } from 'react'
import { GithubIcon } from '~/icons/GithubIcon'
import { LinkedInIcon } from '~/icons/LinkedInIcon'
import { materialSymbolIcons, materialSymbolProps } from '~/icons/material-symbol-icons'
import { cn } from '~/lib/utils'
import { ProjectedContainer } from '../../projected-elements/projected-container'

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

type SocialLinkButtonProps = ComponentPropsWithoutRef<'a'> & { href: string }

function SocialLinkButton({ children, className, href, ...linkProps }: SocialLinkButtonProps) {
  return (
    <ProjectedContainer
      as="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      rounding={24}
      {...linkProps}
      data-entry-animation-type="from-bottom"
      className={cn(
        'relative inline-flex flex-row items-center justify-center gap-2 overflow-hidden p-1 hover:*:first:bg-border hover:*:nth-2:text-foreground-lighter',
        'hover:*:last:scale-100 hover:*:last:opacity-100 hover:*:nth-2:opacity-0',
        className,
      )}
    >
      <div className="absolute inset-0 -z-10 rounded-full border bg-background-lighter/50 transition-colors" />

      <div className="inline-flex items-center justify-center gap-2 font-bold whitespace-nowrap text-foreground transition-[opacity,color] *:[svg]:size-5">
        {children}
      </div>
      <div className="absolute inset-0 flex scale-golden items-center justify-center opacity-0 transition-[opacity,scale]">
        <svg
          viewBox={materialSymbolProps.viewBox}
          className="inline-block size-4.5 fill-foreground-lighter"
        >
          <path d={materialSymbolIcons.OpenInNew} />
        </svg>
      </div>
    </ProjectedContainer>
  )
}

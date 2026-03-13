import type { ComponentProps, ComponentPropsWithoutRef, ReactNode } from 'react'
import { GithubIcon } from '~/icons/GithubIcon'
import { LinkedInIcon } from '~/icons/LinkedInIcon'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { cn } from '~/lib/utils'
import { ProjectedContainer } from '../../projected-elements/projected-container'

export function SocialLinks(props: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'inline-grid grid-cols-[repeat(auto-fit,calc(var(--spacing)*32))] items-start justify-center gap-x-3 gap-y-2 not-print:w-full print:mx-auto print:grid-cols-2',
        props.className,
      )}
    >
      <SocialLinkButton href="https://github.com/aktyn" icon={<GithubIcon />} text="GitHub" />
      <SocialLinkButton
        href="https://www.linkedin.com/in/aktyn"
        icon={<LinkedInIcon />}
        text="LinkedIn"
      />
    </div>
  )
}

type SocialLinkButtonProps = ComponentPropsWithoutRef<'a'> & {
  href: string
  icon: ReactNode
  text: string
}

function SocialLinkButton({ icon, text, className, href, ...linkProps }: SocialLinkButtonProps) {
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
      <div className="absolute inset-0 -z-10 rounded-full border bg-background-lighter/50 transition-colors print:hidden" />

      <div className="inline-flex items-center justify-center gap-2 font-bold whitespace-nowrap text-foreground transition-[opacity,color] *:[svg]:size-5">
        {icon}
        <span className="print:hidden">{text}</span>
        <span className="not-print:hidden">{href}</span>
      </div>
      <div className="absolute inset-0 flex scale-golden items-center justify-center opacity-0 transition-[opacity,scale] print:hidden">
        <SvgIcon icon="OpenInNew" className="inline-block size-4.5 fill-foreground-lighter" />
      </div>
    </ProjectedContainer>
  )
}

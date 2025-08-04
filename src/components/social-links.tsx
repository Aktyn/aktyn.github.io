import { Button } from "./ui/button"
import { GithubIcon } from "~/components/icons/GithubIcon"
import { LinkedInIcon } from "~/components/icons/LinkedInIcon"
import type { ComponentProps } from "react"
import { cn } from "~/lib/utils"
import { ExternalLink } from "lucide-react"

export function SocialLinks() {
  return (
    <div className="w-full mx-auto grid grid-cols-[repeat(auto-fit,calc(var(--spacing)*32))] items-start justify-center gap-x-3 gap-y-2">
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

type SocialLinkButtonProps = ComponentProps<typeof Button> & { href: string }

function SocialLinkButton({
  children,
  className,
  href,
  ...buttonProps
}: SocialLinkButtonProps) {
  return (
    <Button
      asChild
      variant="outline"
      {...buttonProps}
      className={cn(
        "rounded-full bg-accent/30 backdrop-blur-sm hover:bg-secondary hover:border-primary transition-colors h-auto **:[svg]:size-5! relative shadow-[0_0_calc(var(--spacing)*8)_#38251988]",
        "*:transition-[opacity,scale,box-shadow] *:ease-out duration-400 hover:*:first:opacity-0 hover:*:first:scale-0 hover:*:last:opacity-100 hover:*:last:scale-100 hover:shadow-[0_0_calc(var(--spacing)*8)_#192c38]",
        className,
      )}
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
          {children}
        </div>
        <ExternalLink className="absolute inset-auto pointer-events-none opacity-0 scale-0 text-primary" />
      </a>
    </Button>
  )
}

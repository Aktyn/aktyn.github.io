import { Button } from "./ui/button"
import { GithubIcon } from "~/components/icons/GithubIcon.tsx"
import { LinkedInIcon } from "~/components/icons/LinkedInIcon.tsx"

import "./social-links.css"

export function SocialLinks() {
  return (
    <div
      className="social-links-container min-h-[calc(50dvh-var(--spacing)*6)] flex flex-row items-start justify-center pt-4 gap-2"
      onAnimationEnd={(event) =>
        event.currentTarget.classList.add("scroll-based-animation")
      }
    >
      <Button
        asChild
        variant="outline"
        className="rounded-full bg-card hover:bg-secondary hover:text-primary hover:border-primary transition-colors p3-2! h-auto"
      >
        <a
          href="https://github.com/aktyn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon className="size-6" />
          GitHub
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        className="rounded-full bg-card hover:bg-secondary hover:text-primary hover:border-primary transition-colors p3-2! h-auto"
      >
        <a
          href="https://www.linkedin.com/in/aktyn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon className="size-6" />
          LinkedIn
        </a>
      </Button>
    </div>
  )
}

import { Github, ExternalLink } from "lucide-react"
import { Button } from "./ui/button"

import "./social-links.css"

export function SocialLinks() {
  return (
    <div
      className="social-links-container min-h-[calc(50dvh-var(--spacing)*6)] flex flex-row items-start justify-center pt-4"
      onAnimationEnd={(event) =>
        event.currentTarget.classList.add("scroll-based-animation")
      }
    >
      <Button asChild variant="link" size="sm" className="gap-x-3">
        <a
          href="https://github.com/aktyn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="size-8" />
          See more on my GitHub
          <ExternalLink />
        </a>
      </Button>
      <span className="size-8" />
    </div>
  )
}

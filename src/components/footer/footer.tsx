import { useTranslation } from 'react-i18next'
import { GithubProjectLink } from '../common/github-project-link'
import { TechStackGroup } from '../content/sections/tech-stack/tech-stack'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer
      data-entry-animation-type="fade-in"
      className="mx-auto flex flex-col text-center print:hidden"
    >
      <div className="inset-x-auto inset-y-0 flex min-w-dvw flex-col self-center bg-background/30 p-10 text-center">
        <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-2">
          <p
            data-entry-animation
            className="rounded-lg border border-foreground/20 bg-background-lighter/30 p-2 text-sm text-balance whitespace-pre-wrap not-print:shadow-lg"
          >
            {t('footer.description')}
          </p>
          <TechStackGroup
            data-entry-animation
            className="*:[p]:text-muted-foreground"
            title={t('footer.techStack')}
            stack={[
              'html',
              'css',
              'typescript',
              'react',
              'tailwindcss',
              'threejs',
              'bun',
              'vite',
              'storybook',
            ]}
          >
            <GithubProjectLink
              href="https://github.com/Aktyn/aktyn.github.io/tree/codebase"
              title={t('footer.siteRepo')}
            />
          </TechStackGroup>
        </div>
      </div>
    </footer>
  )
}

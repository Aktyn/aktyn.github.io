import { useTranslation } from 'react-i18next'
import { GithubProjectLink } from '../common/github-project-link'
import { Separator } from '../common/separator'
import { TechStackGroup } from '../content/sections/tech-stack/tech-stack'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer
      className="
        mx-auto flex flex-col text-center text-foreground
        [--background-lighter:var(--background-lighter-tetradic-3)]
        [--background:var(--background-tetradic-3)]
        [--foreground-complementary:var(--foreground-tetradic-3-complementary)]
        [--foreground-darker:var(--foreground-darker-tetradic-3)]
        [--foreground-lighter:var(--foreground-lighter-tetradic-3)]
        [--foreground:var(--foreground-tetradic-3)]
        [--muted-foreground:var(--muted-foreground-tetradic-3)]
      "
    >
      <Separator data-entry-animation-type="zoom-in-x" className="mt-4 bg-foreground-lighter/40" />
      <div
        className="
          inset-x-auto inset-y-0 flex min-w-dvw flex-col self-center
          bg-transparent p-10 text-center
        "
      >
        <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-2">
          <p
            data-entry-animation
            className="
              rounded-lg border border-foreground/50 bg-background-lighter p-2
              text-sm text-balance whitespace-pre-wrap shadow-lg
            "
          >
            {t('footer.description')}
            <KofiButton />
          </p>
          <TechStackGroup
            data-entry-animation
            className="
              border-foreground/50 bg-background-lighter
              *:[p]:text-muted-foreground
            "
            title={t('footer.techStack')}
            stack={[
              'html',
              'css',
              'typescript',
              'react',
              'tailwindcss',
              'threejs',
              'nodejs',
              'vite',
              'storybook',
            ]}
          >
            <GithubProjectLink
              href="https://github.com/Aktyn/aktyn.github.io/tree/codebase"
              title={t('footer.siteRepo')}
            />
          </TechStackGroup>
          <span data-entry-animation className="mt-2 -mb-4 text-xs text-muted-foreground">
            {t('common.version')}:&nbsp;{import.meta.env.VITE_APP_VERSION}
          </span>
        </div>
      </div>
    </footer>
  )
}

declare global {
  interface Window {
    kofiwidget2: { init: (text: string, background: string, id: string) => void; draw: () => void }
  }
}

function KofiButton() {
  return (
    <a
      href="https://ko-fi.com/aktyn"
      target="_blank"
      rel="noopener noreferrer"
      className="
        mx-auto mt-2 block w-fit scale-90 opacity-80
        drop-shadow-[0_0_--spacing(3)] drop-shadow-foreground
        transition-[scale,opacity]
        hover:scale-100 hover:opacity-100
      "
    >
      <img
        src="https://storage.ko-fi.com/cdn/brandasset/v2/support_me_on_kofi_beige.png"
        alt="Support me on Ko-fi"
        className="max-h-9"
      />
    </a>
  )
}

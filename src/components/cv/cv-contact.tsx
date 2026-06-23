import { GithubIcon } from '~/icons/GithubIcon'
import { contactValues } from './cv-helpers'
import { LinkedInIcon } from '~/icons/LinkedInIcon'
import type { ComponentProps, ComponentType } from 'react'
import { SvgIcon } from '~/icons/material-symbol-icons'
import { cn } from '~/lib/utils'
import { useTranslation } from 'react-i18next'
import { CvSectionTitle } from './cv-section-title'

export function CvContact() {
  const { t } = useTranslation()

  return (
    <div>
      <CvSectionTitle>{t('cv.contact')}</CvSectionTitle>
      <ul className="space-y-2 text-[11px]">
        {(
          [
            ['Phone', contactValues.phoneNumber, false],
            ['Email', contactValues.email, false],
            [GithubIcon, contactValues.github, true],
            [LinkedInIcon, contactValues.linkedin, true],
            ['Website', contactValues.site, true],
          ] as Array<
            [
              ComponentProps<typeof SvgIcon>['icon'] | ComponentType<ComponentProps<'svg'>>,
              string,
              boolean,
            ]
          >
        ).map(([Icon, value, isLink], index) => (
          <li
            key={`${Icon}-${index}`}
            className={cn(
              `
                flex items-center gap-2 text-black
                **:[svg]:fill-neutral-500
              `,
              Icon === 'Website' && 'items-start',
            )}
          >
            {typeof Icon === 'string' ? (
              <SvgIcon icon={Icon as ComponentProps<typeof SvgIcon>['icon']} className="size-3.5" />
            ) : (
              Icon && <Icon className="size-3.5" />
            )}
            {Icon === 'Website' ? (
              <div className="flex flex-col items-start gap-1">
                <a href={value} className="flex h-3.5 flex-row items-center">
                  {value}
                </a>
                <div className="flex flex-col items-center gap-1">
                  <SvgIcon icon="South" className="size-5" />
                  <img src="/img/site-qr-code.png" alt="Website QR" width={92} height={92} />
                </div>
              </div>
            ) : isLink ? (
              <a href={value}>{value}</a>
            ) : (
              <span>{value}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

import { GithubIcon } from '~/icons/GithubIcon'
import { properNouns } from './cv-helpers'
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
      <ul className="space-y-2 text-[11px] text-neutral-700">
        {(
          [
            ['Phone', properNouns.phoneNumber, false],
            ['Email', properNouns.email, false],
            [GithubIcon, properNouns.github, true],
            [LinkedInIcon, properNouns.linkedin, true],
            ['Website', properNouns.site, true],
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
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6AQMAAACyIsh+AAAABlBMVEX///8AAABVwtN+AAAACXBI
WXMAAA7EAAAOxAGVKw4bAAABdUlEQVRoge2YvXGEQAyFtUNASAmU4tKgNEqhhAsJbpD1swKMPZzA
6VPAgPaL3kjah4g+xcAeb6Kvl37PVHjsa5ZHAAFMplf3JuZXo5l2JeoXyxYAd4BOFJ06lVpeJNsK
1S9FPhYAjwCT2osYwL8Ar1w7A/AI2Nrfqd6l/ms+ALgE2KMCIXXNAsgDp9Cz9ZwEkAFcapsBprc0
vXolueHtASANSOcroC9mOMmb3s4A3AEGd+1u3cVw8txW1zn4G4AkEDaz8cHpUvO8iw4gC5A7JD01
w2mdz3EvAQhAXJCktRytMFVEVfIwSAFkAVHZC9M3GMxrvYZq+wPIApKVeiW/cbSM94IuAG4BzbbB
cBdUTOj40QGQBPZwKm7s/doBkAO8092U+36SyuGXcQSQBiYTtKt+sm4wqtQFwB3gx37yENt8AHAf
0MtJ2/8wTQE8AfSX0Vy7zdDh91IdwCUQ7W8LoWh/1fs8HwBcA7XZTWrmUDkCQBr4FN+iQ3qsX6Vz
gAAAAABJRU5ErkJggg=="
                    alt="Website QR"
                    width={92}
                    height={92}
                  />
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

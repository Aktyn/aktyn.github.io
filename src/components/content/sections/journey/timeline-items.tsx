import { Suspense } from 'react'
import { Skeleton } from '~/components/common/skeleton'
import { Diploma } from './diploma'
import { CompactImagesStrip } from './compact-images-strip'
import { ProjectsGroup, useProjectsGroupsInfo } from '~/lib/projects-info'
import { GithubProjectLink } from '~/components/common/github-project-link'
import { LinkedInIcon } from '~/icons/LinkedInIcon'
import { QuickProjectInfo } from '~/components/content/sections/journey/quick-project-info'
import { GraphicsAspirations } from '~/components/content/sections/journey/graphics-aspirations'
import { useTranslation } from 'react-i18next'

export const useSchoolTimelineItems = () => {
  const { t } = useTranslation()

  return [
    {
      date: t('timeline.school.gePower.date'),
      content: (
        <p>
          {t('timeline.school.gePower.desc1')} <b>{t('timeline.school.gePower.company')}</b>
        </p>
      ),
    },
    {
      date: t('timeline.school.competition.date'),
      content: (
        <div className="flex flex-col items-start">
          <p>{t('timeline.school.competition.title')}</p>
          <div className="flex flex-row flex-wrap-reverse items-center gap-x-4 gap-y-1">
            <Suspense fallback={<Skeleton className="h-48 w-32" />}>
              <Diploma />
            </Suspense>
            <span className="max-w-80 flex-0 grow text-sm text-pretty">
              {t('timeline.school.competition.desc')}
            </span>
          </div>
        </div>
      ),
    },
    {
      date: t('timeline.school.graduation.date'),
      content: (
        <p>
          {t('timeline.school.graduation.desc1')} <b>{t('timeline.school.graduation.title')}</b>{' '}
          <span className="text-sm">{t('timeline.school.graduation.titlePl')}</span>
        </p>
      ),
    },
  ]
}

export const useUniversityTimelineItems = () => {
  const { t } = useTranslation()
  const projectsGroupsInfo = useProjectsGroupsInfo()
  return [
    {
      date: t('timeline.university.zerog.date'),
      content: (
        <div className="flex flex-col items-stretch">
          <div className="z-20 font-semibold">
            <GithubProjectLink title="ZeroG Ball" href="https://github.com/Aktyn/ZeroG-Ball" />{' '}
            <span>- {t('timeline.university.zerog.desc')}</span>
          </div>
          <CompactImagesStrip
            images={
              projectsGroupsInfo[ProjectsGroup.GameDevelopment].projects.find(
                (p) => p.title === 'ZeroG Ball',
              )?.images ?? []
            }
            altPrefix="ZeroG-Ball"
            className="-ml-10 **:data-[slot=images-strip-content-container]:pl-10"
          />
        </div>
      ),
    },
    {
      date: t('timeline.university.job.date'),
      content: <p className="z-30">{t('timeline.university.job.desc')}</p>,
    },
    {
      date: t('timeline.university.asystent.date'),
      content: (
        <div>
          <p className="font-semibold text-balance">
            <GithubProjectLink
              href="https://github.com/Aktyn/AsystentGlosowy"
              title="Asystent głosowy"
            />{' '}
            <span>- {t('timeline.university.asystent.desc1')} </span>
          </p>
          <p className="text-sm text-pretty">{t('timeline.university.asystent.desc2')}</p>
        </div>
      ),
    },
  ]
}

export const useWorkExperienceTimelineItems = () => {
  const { t } = useTranslation()
  const projectsGroupsInfo = useProjectsGroupsInfo()
  return [
    {
      date: {
        start: t('timeline.work.enigma.start'),
        end: t('timeline.work.enigma.end'),
      },
      content: (
        <div className="flex flex-col items-start">
          <p className="z-10 font-semibold text-balance">
            {t('timeline.work.enigma.title')}{' '}
            <a href="https://www.enigma.com.pl/" target="_blank" className="underline">
              {t('names.enigma')}
            </a>
          </p>
          <p className="z-10 mb-1 text-sm text-pretty">
            {t('timeline.work.enigma.desc1')} <i>{t('names.reactTypescript')}</i>{' '}
            {t('timeline.work.enigma.desc2')}{' '}
            <GithubProjectLink
              href="https://github.com/Aktyn/React-Map-POI"
              title="React-Map-POI"
              className="inline-flex flex-row items-center gap-1"
            />
            .
          </p>
          <CompactImagesStrip
            images={
              projectsGroupsInfo[ProjectsGroup.WebDevelopment].projects.find(
                (p) => p.title === 'Map POI',
              )?.images ?? []
            }
            altPrefix="React-Map-POI"
            className="-ml-3 min-w-full"
          />
          <p className="z-10 mt-4 text-sm text-pretty">{t('timeline.work.enigma.desc3')}</p>
          <p className="z-10 text-sm text-pretty">
            {t('timeline.work.enigma.desc4')}
            <br />
            {t('timeline.work.enigma.desc5')}{' '}
            <span className="font-semibold">{t('names.postgresql')}</span>{' '}
            {t('timeline.work.enigma.desc6')}
          </p>
        </div>
      ),
    },
    {
      date: {
        start: t('timeline.work.nightWoods.start'),
        end: t('timeline.work.nightWoods.end'),
      },
      content: (
        <div>
          <p className="font-semibold">
            {t('timeline.work.nightWoods.title')}{' '}
            <a
              href="https://www.linkedin.com/company/night-woods/"
              target="_blank"
              className="inline-flex flex-row items-center gap-1 underline"
            >
              <LinkedInIcon className="size-3" />
              {t('names.nightWoods')}
            </a>
          </p>
          <p className="text-sm text-pretty">
            <span className="font-light">{t('timeline.work.nightWoods.desc1')}</span>
            <br />
            {t('timeline.work.nightWoods.desc2')} <b>{t('timeline.work.nightWoods.desc3')}</b>{' '}
            {t('timeline.work.nightWoods.desc_and')} <b>{t('timeline.work.nightWoods.desc4')}</b>{' '}
            {t('timeline.work.nightWoods.desc5')}
            <br />
            {t('timeline.work.nightWoods.desc6')} <b>{t('timeline.work.nightWoods.desc7')}</b>{' '}
            {t('timeline.work.nightWoods.desc8')}
            <span className="font-semibold">{t('names.figma')}</span>).
          </p>
        </div>
      ),
    },
  ]
}

export const useFreeTimeProjectsTimelineItems = () => {
  const { t } = useTranslation()
  return [
    {
      date: t('timeline.games.date'),
      content: (
        <div>
          <p>
            {t('timeline.games.goal')}{' '}
            <span className="text-sm text-muted-foreground">{t('timeline.games.pursued')}</span>
          </p>
          <div>
            <div>
              <p className="text-sm">{t('timeline.games.desc')}</p>
              <ul className="*:ml-2">
                <QuickProjectInfo
                  component="li"
                  githubLink="https://github.com/Aktyn/BertaSnakes"
                  title={t('timeline.projects.berta.title')}
                  description={t('timeline.projects.berta.desc')}
                  className="text-pretty"
                />
                <QuickProjectInfo
                  component="li"
                  githubLink="https://github.com/Aktyn/ZeroG-Ball"
                  title={t('timeline.projects.zerog.title')}
                  description={t('timeline.projects.zerog.desc')}
                />
                <QuickProjectInfo
                  component="li"
                  githubLink="https://github.com/Aktyn/Ten-tac-toe"
                  title={t('timeline.projects.tentactoe.title')}
                  description={t('timeline.projects.tentactoe.desc')}
                />
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      date: t('timeline.web.date'),
      content: (
        <div>
          <p>{t('timeline.web.desc1')}</p>
          <ul className="*:ml-2">
            <QuickProjectInfo
              component="li"
              githubLink="https://github.com/Aktyn/in2rp_homepage"
              title={t('timeline.projects.in2rp.title')}
              description={t('timeline.projects.in2rp.desc')}
            />
            <QuickProjectInfo
              component="li"
              githubLink="https://github.com/Aktyn/ProjectParadise"
              title={t('timeline.projects.paradise.title')}
              description={t('timeline.projects.paradise.desc')}
            />
            <QuickProjectInfo
              component="li"
              githubLink="https://github.com/Aktyn/web-scraper"
              title={t('timeline.projects.scraper.title')}
              description={t('timeline.projects.scraper.desc')}
            />
          </ul>
        </div>
      ),
    },
    {
      date: t('timeline.genetic.date'),
      content: (
        <div>
          <p>{t('timeline.genetic.desc')}</p>
          <ul className="*:ml-2">
            <QuickProjectInfo
              component="li"
              githubLink="https://github.com/Aktyn/Genetic-Algorithm"
              title={t('timeline.projects.genetic.title')}
              description={t('timeline.projects.genetic.desc')}
            />
          </ul>
        </div>
      ),
    },
    {
      date: t('timeline.microcontrollers.date'),
      content: (
        <div>
          <p>
            {t('timeline.microcontrollers.desc1')}{' '}
            <a
              href="https://www.raspberrypi.com/"
              target="_blank"
              className="font-semibold underline"
            >
              {t('names.raspberryPi')}
            </a>
          </p>
          <ul className="*:ml-2">
            <QuickProjectInfo
              component="li"
              githubLink="https://github.com/Aktyn/aktyn-drone"
              title={t('timeline.projects.drone.title')}
              description={t('timeline.projects.drone.desc')}
              className="text-pretty"
            />
            <QuickProjectInfo
              component="li"
              githubLink="https://github.com/Aktyn/Bike-Tour-Assistant"
              title={t('timeline.projects.bike.title')}
              description={t('timeline.projects.bike.desc')}
              className="text-pretty"
            />
          </ul>
        </div>
      ),
    },
    {
      date: t('timeline.graphics.date'),
      content: (
        <div className="inline-flex flex-row flex-wrap justify-start gap-x-4 gap-y-1 max-md:flex-col md:items-center">
          <div className="flex-0 grow text-sm text-pretty">
            <p>
              {t('timeline.graphics.desc1')}{' '}
              <span className="text-sm">{t('timeline.graphics.desc1_sub')}</span>,{' '}
              {t('timeline.graphics.desc2')}
            </p>
            <p>{t('timeline.graphics.desc3')}</p>
            <ul className="mt-2 *:ml-2">
              <QuickProjectInfo
                githubLink="https://github.com/Aktyn/Blender-portfolio"
                title={t('timeline.projects.blender.title')}
              />
            </ul>
          </div>
          <Suspense fallback={<Skeleton className="h-32 w-58" />}>
            <GraphicsAspirations />
          </Suspense>
        </div>
      ),
    },
  ]
}

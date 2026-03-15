import { animate, onScroll, type TargetsParam } from 'animejs'
import {
  useEffect,
  useMemo,
  useRef,
  type ComponentProps,
  type PropsWithChildren,
  type RefObject,
} from 'react'
import { materialSymbolProps, SvgIcon } from '~/icons/material-symbol-icons'
import { contentViewportID, Section } from '~/lib/consts'
import { journeyInfo, JourneySection } from '~/lib/journey-info'
import { ProjectsGroup, projectsGroupsInfo } from '~/lib/projects-info'
import { TechStackCategory, techStackInfo } from '~/lib/tech-stack'
import { cn } from '~/lib/utils'
import { type ProjectedComponentRef } from '../content/content-helpers'
import { ProjectedContainer } from '../content/projected-elements/projected-container'

type UpdateListener = () => unknown

type SubItemData = {
  key: string
  title: string
  icon: ComponentProps<typeof SvgIcon>['icon']
}

type UpdatableProps = {
  registerUpdateListener: (listener: UpdateListener) => void
  unregisterUpdateListener: (listener: UpdateListener) => void
}

type NavItemProps = PropsWithChildren<
  {
    section: Section
  } & UpdatableProps
>

export function NavItem({ children, section, ...updatableInterface }: NavItemProps) {
  const ref = useRef<ProjectedComponentRef>(null)

  const sectionIndex = Object.values(Section).indexOf(section)

  useUpdatable(ref, updatableInterface)
  useNavItemAnimation(ref, `#${section}`, section !== Section.Intro)

  const subItems = useMemo<SubItemData[]>(() => {
    switch (section) {
      case Section.Intro:
        return []
      case Section.MyJourney:
        return Object.values(JourneySection).map((section) => ({
          key: section,
          title: journeyInfo[section].title,
          icon: journeyInfo[section].icon,
        }))
      case Section.PublicProjects:
        return Object.values(ProjectsGroup).map((section) => ({
          key: section,
          title: projectsGroupsInfo[section].title,
          icon: projectsGroupsInfo[section].icon,
        }))
      case Section.TechStack:
        return Object.values(TechStackCategory).map((category) => ({
          key: category,
          title: techStackInfo[category].title,
          icon: techStackInfo[category].icon,
        }))
    }
  }, [section])

  return (
    <div
      className={cn(
        'flex min-w-54 flex-col items-center gap-1',
        section === Section.Intro && 'items-stretch',
        sectionIndex === 1 &&
          '*:text-[color-mix(in_oklch,var(--color-foreground-tetradic-1)_40%,var(--color-foreground))]',
        sectionIndex === 2 &&
          '*:text-[color-mix(in_oklch,var(--color-foreground-tetradic-2)_40%,var(--color-foreground))]',
        sectionIndex === 3 &&
          '*:text-[color-mix(in_oklch,var(--color-foreground-tetradic-3)_40%,var(--color-foreground))]',
      )}
    >
      <ProjectedContainer
        ref={ref}
        as="a"
        rounding={6}
        data-slot="navigation-item"
        href={`#${section}`}
        className={cn(
          'flex flex-row items-center justify-center gap-1 rounded-md border border-foreground/40 bg-foreground/20 px-3 py-1 text-lg font-medium hover:border-foreground-complementary/40 hover:bg-foreground-complementary/20 hover:text-foreground-complementary *:[svg]:size-5',
          sectionIndex === 1 && 'border-foreground-tetradic-1/40 bg-foreground-tetradic-1/20',
          sectionIndex === 2 && 'border-foreground-tetradic-2/40 bg-foreground-tetradic-2/20',
          sectionIndex === 3 && 'border-foreground-tetradic-3/40 bg-foreground-tetradic-3/20',
        )}
      >
        {children}
      </ProjectedContainer>
      {subItems.map((item) => (
        <SubItem key={item.key} item={item} sectionIndex={sectionIndex} {...updatableInterface} />
      ))}
    </div>
  )
}

type SubItemProps = {
  item: SubItemData
  sectionIndex: number
} & UpdatableProps

function SubItem({ item, sectionIndex, ...updatableInterface }: SubItemProps) {
  const ref = useRef<ProjectedComponentRef>(null)

  useUpdatable(ref, updatableInterface)
  useNavItemAnimation(ref, `#${item.key}`)

  return (
    <ProjectedContainer
      ref={ref}
      as="a"
      rounding={6}
      data-slot="navigation-item"
      data-section-index={sectionIndex} // Used in connector to colorize lines
      href={`#${item.key}`}
      className={cn(
        'flex flex-row items-center justify-center gap-1 rounded-md bg-foreground/20 px-1.5 py-0.5 text-sm hover:text-foreground-complementary *:[svg]:size-4',
        sectionIndex === 1 && 'bg-foreground-tetradic-1/15',
        sectionIndex === 2 && 'bg-foreground-tetradic-2/15',
        sectionIndex === 3 && 'bg-foreground-tetradic-3/15',
      )}
    >
      <SvgIcon
        viewBox={
          item.key === ProjectsGroup.RaspberryPi.toString()
            ? '0 0 48 48'
            : materialSymbolProps.viewBox
        }
        icon={item.icon}
      />
      {item.title}
    </ProjectedContainer>
  )
}

function useUpdatable(
  ref: RefObject<ProjectedComponentRef | null>,
  updatableInterface: UpdatableProps,
) {
  useEffect(() => {
    const listener = () => ref.current?.updatePosition?.()

    updatableInterface.registerUpdateListener(listener)

    return () => {
      updatableInterface.unregisterUpdateListener(listener)
    }
  }, [ref, updatableInterface])
}

function useNavItemAnimation(
  projectedRef: RefObject<ProjectedComponentRef | null>,
  target: TargetsParam,
  enable = true,
) {
  useEffect(() => {
    const element = projectedRef.current?.elementRef.current

    if (!element || !enable) {
      return
    }

    const animation = animate(element, {
      width: ['90%', '100%'],
      marginLeft: ['10%', '0%'],
      duration: 800,
      ease: 'inOutBack(1.7)',
      autoplay: onScroll({
        container: `#${contentViewportID} [data-radix-scroll-area-viewport]`,
        target,
        enter: { target: 'top+=8rem', container: 'bottom' },
        leave: { target: 'bottom-=8rem', container: 'top' },
        sync: 'play reverse play reverse',
        // debug: import.meta.env.DEV,
      }),
    })

    return () => {
      animation.revert()
    }
  }, [enable, projectedRef, target])
}

import { lazy, Suspense, useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { RootPortal } from '~/components/portal/root-portal'
import { cn } from '~/lib/utils'

const LazyMaximizedGallery = lazy(() => import('~/components/gallery/maximized-gallery'))

type FullBlenderPortfolioButtonProps = ComponentProps<'button'>

export function FullBlenderPortfolioButton(props: FullBlenderPortfolioButtonProps) {
  const { t } = useTranslation()

  const [openGallery, setOpenGallery] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <>
      <button
        {...props}
        className={cn(
          `
            inline-flex min-w-54 flex-row items-center justify-center gap-1
            rounded-md border border-muted-foreground/50 bg-background/50 p-1
            px-2 text-sm font-semibold text-balance transition-colors
            hover:border-foreground-lighter hover:bg-background
            hover:text-foreground-lighter
          `,
          props.className,
        )}
        onClick={() => setOpenGallery(true)}
      >
        {t('full-blender-gallery.button')}
      </button>
      <RootPortal>
        <Suspense fallback={<span className="fixed inset-0">...</span>}>
          <LazyMaximizedGallery
            open={openGallery}
            onClose={() => setOpenGallery(false)}
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            images={fullImageSources}
            index={index}
            onIndexChange={setIndex}
          />
        </Suspense>
      </RootPortal>
    </>
  )
}

const urlBase = 'https://github.com/Aktyn/Blender-portfolio/blob/master/img/'
const imageNames = [
  'psyduck.png',
  'table tennis.png',
  'sniadanko.png',
  'cat_sorcerer.png',
  'yoyo.png',
  'LavaCave.png',
  'fafik_2.png',
  'abstract_lines.png',
  'blur_boosted.png',
  'cat.png',
  'wieza_eiffla.png',
  'code_background.png',
  'hairy-logo-v1-postprocess.png',
  'old_ball.png',
  'liczydlo_yyy.jpg',
  'metal_logo.png',
  'robocik.png',
  'rower.png',
  'rubikHZB.png',
  'srajfaj_tapeta.png',
  'szczachy.png',
  'tapetka_logo_vX.png',
  'deskorolkolotka z drewna.png',
  'guma je linijke i serpentyna.png',
  'hexacostam.png',
  'lustro.png',
  'neon_logo_wallpaper.png',
  'oponowo.png',
  'pokoik.png',
  'pokoikX.png',
  'kot.png',
  'cars.png',
  'abaszor.png',
  'sloneczko.png',
  'miedz.png',
  'jajka.png',
  'logo_wallpaper_2022.png',
  'Mobile abstract wallpaper.png',
  'Mobile abstract wallpaper + logo.png',
  'zabawki_kota.png',
  'trees from below.png',
  'ufo_lubi_w_gore.png',
  'walentylator.png',
  'weird_tree_v4.png',
  'wolf.png',
  'DNA.png',
  'Bicycle POV.png',
]
const fullImageSources = imageNames.map((imageName) => encodeURI(`${urlBase}${imageName}?raw=true`))

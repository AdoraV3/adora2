'use client'

import * as React from 'react'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type CarouselApi = UseEmblaCarouselType[1]
interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: Parameters<typeof useEmblaCarousel>[0]
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

interface CarouselContextProps {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }
  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  CarouselProps
>(
  (
    {
      orientation = 'horizontal',
      opts,
      setApi,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      []
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) return
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          scrollPrev()
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api) return
      onSelect(api)
      api.on('reInit', onSelect)
      api.on('select', onSelect)

      return () => {
        api?.off('select', onSelect)
      }
    }, [api, onSelect])

    React.useEffect(() => {
      setApi?.(api)
    }, [api, setApi])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative w-full', className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = 'Carousel'

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn('flex', className)}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = 'CarouselContent'

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    aria-roledescription="slide"
    className={cn(
      'min-w-0 shrink-0 grow-0 basis-full',
      className
    )}
    {...props}
  />
))
CarouselItem.displayName = 'CarouselItem'

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel()

  return (
    <button
      ref={ref}
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      className={cn(
        'absolute left-0 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white disabled:opacity-50',
        className
      )}
      aria-label="Previous slide"
      {...props}
    >
      <ChevronLeft className="h-5 w-5 text-gray-800" />
      <span className="sr-only">Previous slide</span>
    </button>
  )
})
CarouselPrevious.displayName = 'CarouselPrevious'

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel()

  return (
    <button
      ref={ref}
      onClick={scrollNext}
      disabled={!canScrollNext}
      className={cn(
        'absolute right-0 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white disabled:opacity-50',
        className
      )}
      aria-label="Next slide"
      {...props}
    >
      <ChevronRight className="h-5 w-5 text-gray-800" />
      <span className="sr-only">Next slide</span>
    </button>
  )
})
CarouselNext.displayName = 'CarouselNext'

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}

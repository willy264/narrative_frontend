// SplitReveal — word-split entrance animation utility
// useGSAP + gsap.set for immediate hide, gsap.to for reveal
import { useRef } from 'react'
import type { ElementType, CSSProperties } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface Props {
  text: string
  as?: ElementType
  stagger?: number
  delay?: number
  scrollTrigger?: boolean
  duration?: number
  className?: string
  style?: CSSProperties
}

const SplitReveal = ({
  text,
  as: Tag = 'div' as ElementType,
  stagger = 0.07,
  delay = 0,
  scrollTrigger: useScroll = true,
  duration = 0.85,
  className,
  style,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRefs    = useRef<HTMLSpanElement[]>([])
  const words        = text.split(' ')

  useGSAP(() => {
    innerRefs.current = innerRefs.current.slice(0, words.length)
    const els = innerRefs.current.filter(Boolean)
    if (!els.length) return

    // Immediately hide before paint
    gsap.set(els, { yPercent: 110, opacity: 0 })

    const toVars: gsap.TweenVars = {
      yPercent: 0,
      opacity: 1,
      duration,
      ease: 'power3.out',
      stagger,
    }

    if (useScroll) {
      gsap.to(els, {
        ...toVars,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 88%',
        },
      })
    } else {
      gsap.to(els, { ...toVars, delay })
    }
  }, { scope: containerRef })

  const Component = Tag as ElementType

  return (
    <Component ref={containerRef} className={className} style={style}>
      {words.map((word: string, i: number) => (
        <span key={i} className="word-wrap" style={{ marginRight: '0.28em' }}>
          <span
            className="word-inner"
            ref={(el: HTMLSpanElement | null) => {
              if (el) innerRefs.current[i] = el
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Component>
  )
}

export default SplitReveal

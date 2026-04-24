import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  PipelineDesktop,
  PipelineMobile,
} from './horizontal-pipeline/HorizontalPipelineSections'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const HorizontalPipeline = () => {
  const outerRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const media = gsap.matchMedia()

    media.add('(min-width: 768px)', () => {
      const outer = outerRef.current!
      const track = trackRef.current!
      const holdDuration = 0.12
      const moveDuration = 0.76
      const getScrollAmount = () => Math.max(0, track.scrollWidth - outer.clientWidth)

      gsap.set([outer, track], { force3D: true })
      gsap.set(track, { x: 0, willChange: 'transform' })

      const containerTimeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: outer,
          pin: true,
          pinSpacing: true,
          scrub: 1.15,
          start: 'top top',
          end: () => `+=${getScrollAmount() + window.innerHeight * 0.24}`,
          invalidateOnRefresh: true,
          anticipatePin: 1.2,
          fastScrollEnd: true,
        },
      })

      containerTimeline
        .to(track, { x: 0, duration: holdDuration })
        .to(track, {
          x: () => -getScrollAmount(),
          duration: moveDuration,
          immediateRender: false,
        })
        .to(track, {
          x: () => -getScrollAmount(),
          duration: holdDuration,
          immediateRender: false,
        })

      track.querySelectorAll('.h-panel').forEach((panel) => {
        const items = panel.querySelectorAll('.h-item')
        if (!items.length) return

        gsap.fromTo(
          items,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: containerTimeline,
              start: 'left 72%',
            },
          }
        )
      })

      return () => {
        gsap.set(track, { clearProps: 'transform,willChange' })
      }
    })

    return () => media.revert()
  }, { scope: outerRef })

  return (
    <section
      id="pipeline"
      ref={outerRef}
      className="overflow-hidden border-y border-[#1E1E32] bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.06),transparent_28%),rgba(7,7,15,0.78)]"
    >
      <PipelineMobile />
      <PipelineDesktop trackRef={trackRef} />
    </section>
  )
}

export default HorizontalPipeline

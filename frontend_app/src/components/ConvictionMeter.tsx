import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  CONVICTION_LOG_LINES,
  ConvictionHeader,
  ConvictionOverview,
  ConvictionTerminal,
} from './conviction-meter/ConvictionMeterSections'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const ConvictionMeter = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const [visibleLines, setVisibleLines] = useState(0)

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 72%',
      once: true,
      onEnter: () => {
        CONVICTION_LOG_LINES.forEach((_, index) => {
          gsap.delayedCall(index * 0.32, () => setVisibleLines((value) => value + 1))
        })
      },
    })

    gsap.fromTo(
      '.node-card',
      { y: 16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
      }
    )

    gsap.fromTo(
      '.gauge-wrap',
      { scale: 0.85, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      }
    )
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="how-it-thinks"
      className="border-b border-[#1E1E32] bg-[#0A0A16] px-[clamp(24px,5vw,80px)] py-[clamp(64px,8vw,120px)]"
    >
      <div className="mx-auto max-w-[1280px]">
        <ConvictionHeader />
        <ConvictionOverview />
        <ConvictionTerminal visibleLines={visibleLines} />
      </div>
    </section>
  )
}

export default ConvictionMeter

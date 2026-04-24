import { useRef } from 'react'
import type { MouseEvent } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  CTAFeaturePanel,
  CTAFlowBenefitsPanel,
  CTAIntroRow,
  CTALaunchPathPanel,
  CTANotesGrid,
  CTAStatusPanel,
} from './cta/CTASections'
import { scrollToTarget } from '../utils/scroll'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const CTA = () => {
  const sectionRef = useRef<HTMLElement>(null)

  const handleScroll = (event: MouseEvent<HTMLAnchorElement>, target: string) => {
    event.preventDefault()
    scrollToTarget(target, { offset: -72 })
  }

  useGSAP(() => {
    gsap.fromTo(
      '.cta-reveal',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.82,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
        },
      }
    )

    gsap.fromTo(
      '.cta-step',
      { x: -28, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.62,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
        },
      }
    )

    gsap.fromTo(
      '.cta-status-row',
      { x: 18, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.06,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
        },
      }
    )

    gsap.to('.cta-scan-line', {
      xPercent: 145,
      duration: 4.2,
      repeat: -1,
      ease: 'none',
    })

    gsap.to('.cta-signal-dot', {
      opacity: 0.28,
      scale: 0.7,
      duration: 0.9,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.12,
    })
  }, { scope: sectionRef })

  return (
    <section
      id="start"
      ref={sectionRef}
      className="relative overflow-hidden border-y border-[#1E1E32] bg-[linear-gradient(180deg,rgba(8,8,16,0.96),rgba(5,5,10,1))] px-[clamp(24px,5vw,80px)] py-[clamp(92px,11vw,168px)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />
        <div className="absolute left-[-4%] top-[10%] h-[280px] w-[280px] bg-[#00E676]/[0.08] blur-[130px]" />
        <div className="absolute right-[-2%] top-[18%] h-[340px] w-[340px] bg-[#FACC15]/[0.05] blur-[150px]" />
        <div className="absolute left-[16%] bottom-[10%] h-[220px] w-[220px] bg-[#B0B0C8]/[0.05] blur-[120px]" />
        <div className="absolute inset-x-[12%] top-0 h-px bg-gradient-to-r from-transparent via-[#00E676]/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1540px]">
        <CTAIntroRow />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
          <div className="grid min-w-0 gap-6">
            <CTAFeaturePanel onNavigate={handleScroll} />
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
              <CTALaunchPathPanel />
              <CTAFlowBenefitsPanel />
            </div>
          </div>

          <CTAStatusPanel />
        </div>

        <CTANotesGrid />
      </div>
    </section>
  )
}

export default CTA

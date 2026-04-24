import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FeaturesGrid, FeaturesHeader, FeaturesHighlights } from './features/FeaturesSections'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const Features = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      '.feat-card',
      { y: 46, opacity: 0, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.72,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      }
    )

    gsap.fromTo(
      '.feat-wire',
      { scaleX: 0, opacity: 0 },
      {
        scaleX: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.05,
        transformOrigin: 'left center',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    )

    gsap.to('.feat-orb', {
      y: -18,
      duration: 4.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.5,
    })
  }, { scope: sectionRef })

  return (
    <section
      id="system"
      ref={sectionRef}
      className="relative overflow-hidden border-b border-[#1E1E32] bg-[radial-gradient(circle_at_top_left,rgba(0,230,118,0.07),transparent_26%),rgba(7,7,15,0.74)] px-[clamp(24px,5vw,80px)] py-[clamp(72px,8vw,128px)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="feat-orb absolute left-[8%] top-[16%] h-28 w-28 rounded-full bg-[#00E676]/[0.05] blur-[80px]" />
        <div className="feat-orb absolute right-[10%] top-[28%] h-40 w-40 rounded-full bg-[#FACC15]/[0.04] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1320px]">
        <FeaturesHeader />
        <FeaturesHighlights />
        <FeaturesGrid />
      </div>
    </section>
  )
}

export default Features

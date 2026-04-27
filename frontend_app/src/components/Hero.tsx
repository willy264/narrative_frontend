import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroNavBar } from './Navbar'
import { HeroLeftPanel, HeroRightPanel, TYPING_PHRASES } from './hero/HeroSections'
import { scrollToTarget } from '../utils/scroll'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [typed, setTyped] = useState('')
  const [typing, setTyping] = useState(true)

  useGSAP(() => {
    const timeline = gsap.timeline({ delay: 0.2 })

    timeline.fromTo('.hero-nav-left', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' })
    timeline.fromTo('.hero-nav-right', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    timeline.fromTo('.nav-social-icon', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, stagger: 0.06, ease: 'back.out(1.7)' }, '-=0.2')
    timeline.fromTo('.hero-grid-card', { y: 16, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out' }, '-=0.2')
    timeline.fromTo('.hero-split-line', { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: 'power2.inOut' }, 0.3)
    timeline.fromTo('.hero-word', { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, 0.5)
    timeline.fromTo('.hero-typing', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
    timeline.fromTo('.hero-attr', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' }, '-=0.2')

    gsap.to('.hero-attr-shell', {
      y: -6,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.18,
      delay: 1.4,
    })

    gsap.to('.hero-attr-beam', {
      xPercent: 450,
      duration: 2.6,
      repeat: -1,
      ease: 'none',
      stagger: 0.32,
      delay: 1.2,
    })

    gsap.to('.hero-attr-marker', {
      opacity: 0.25,
      y: 3,
      duration: 1.15,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.18,
      delay: 1.25,
    })

    timeline.fromTo('.hero-bottom-left', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2')
    timeline.fromTo('.hero-partner-strip', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2')
    timeline.fromTo('.hero-scroll-btn', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.2')
  }, { scope: heroRef })

  useEffect(() => {
    const phrase = TYPING_PHRASES[phraseIdx]
    let timeout: ReturnType<typeof setTimeout>

    if (typing) {
      timeout = typed.length < phrase.length
        ? setTimeout(() => setTyped(phrase.slice(0, typed.length + 1)), 42)
        : setTimeout(() => setTyping(false), 1800)
    } else if (typed.length > 0) {
      timeout = setTimeout(() => setTyped(typed.slice(0, -1)), 22)
    } else {
      setPhraseIdx((index) => (index + 1) % TYPING_PHRASES.length)
      setTyping(true)
      return
    }

    return () => clearTimeout(timeout)
  }, [typed, typing, phraseIdx])

  const handleHeroScroll = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    scrollToTarget('#footer', { offset: -16 })
  }

  return (
    <section id="hero-section" ref={heroRef} className="relative flex min-h-screen overflow-hidden">
      <div className="absolute bottom-0 left-1/2 top-0 z-20 hidden w-px -translate-x-1/2 md:block">
        <div className="hero-split-line h-full w-full origin-top bg-[#1E1E32]" style={{ transform: 'scaleY(0)' }} />
      </div>

      <HeroNavBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <HeroLeftPanel typed={typed} />
      <HeroRightPanel onScrollClick={handleHeroScroll} />
    </section>
  )
}

export default Hero

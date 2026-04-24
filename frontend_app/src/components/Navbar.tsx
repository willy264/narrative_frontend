import { useEffect, useRef, useState } from 'react'
import type { Dispatch, MouseEvent, SetStateAction } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Grid2x2XIcon } from 'lucide-react'
import { getLenisInstance, isInternalHashLink, scrollToTarget } from '../utils/scroll'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const MENU_ITEMS = [
  { num: '01', label: 'Live Markets', href: '#marquee' },
  { num: '02', label: 'Operating Layer', href: '#system' },
  { num: '03', label: 'Agents', href: '#agents' },
  { num: '04', label: 'Beta Access', href: '#start' },
]

const SOCIAL_LINKS = [
  {
    label: 'Discord',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
        <path d="M16 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
        <path d="M9.09 16s1.27 1 2.91 1 2.91-1 2.91-1" />
        <path d="M19.73 16.33A2 2 0 0 0 21 14.67V9.4a2 2 0 0 0-.8-1.6l-5.6-4.2a2 2 0 0 0-2.4 0l-5.6 4.2A2 2 0 0 0 5.8 9.4v5.27a2 2 0 0 0 1.27 1.66l4 1.6a2 2 0 0 0 1.86 0Z" />
      </svg>
    ),
  },
  {
    label: 'X / Twitter',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Medium',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    ),
  },
]

const navigateTo = (
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
  onBeforeNavigate?: () => void
) => {
  if (!isInternalHashLink(href)) {
    onBeforeNavigate?.()
    return
  }

  event.preventDefault()
  onBeforeNavigate?.()

  window.setTimeout(() => {
    scrollToTarget(href, { offset: -88 })
  }, onBeforeNavigate ? 180 : 0)
}

const Navbar = () => {
  const barRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const lenis = getLenisInstance()
    if (!lenis) return

    if (menuOpen) {
      lenis.stop()
    } else {
      lenis.start()
    }
  }, [menuOpen])

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: '#hero-section',
      start: 'bottom 80px',
      onEnter: () => setVisible(true),
      onLeaveBack: () => {
        setVisible(false)
        setMenuOpen(false)
      },
    })
  }, {})

  useGSAP(() => {
    if (!barRef.current) return

    if (visible) {
      gsap.fromTo(
        barRef.current,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
      )
    } else {
      gsap.to(barRef.current, {
        y: -60,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      })
    }
  }, { dependencies: [visible] })

  useGSAP(() => {
    if (!menuOpen) return

    gsap.fromTo(
      '.sticky-grid-card',
      { y: 14, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out', delay: 0.08 }
    )
  }, { dependencies: [menuOpen] })

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 z-[100] opacity-0"
      style={{ transform: 'translateY(-60px)' }}
    >
      <div className="flex h-16 items-center justify-between border-b border-[#1E1E32]/50 bg-[#07070F]/92 px-4 backdrop-blur-[16px] sm:px-7">
        <a
          href="#marquee"
          onClick={(event) => {
            navigateTo(event, '#marquee')
          }}
          className="flex items-center gap-2.5 no-underline"
        >
          <img src="/logo-mark.svg" alt="Narrative" className="h-6 w-6 shrink-0 object-contain sm:h-7 sm:w-7" />
          <span className="font-brand hidden text-[15px] font-bold uppercase tracking-[0.08em] text-white xs:block sm:text-[17px]">
            Narrative
          </span>
        </a>

        <button
          onClick={() => setMenuOpen((value) => !value)}
          className="group flex cursor-pointer items-center gap-6 border border-[#1E1E32] bg-[#0D0D1A] px-4 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition-all duration-200 hover:border-2 hover:border-dashed hover:border-[#00e67774] sm:gap-20 sm:px-6 sm:py-3.5 sm:text-[13px]"
        >
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
          <Grid2x2XIcon size={14} className="text-[#5A5A7A]" />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex justify-end px-4 pb-5 pt-2 sm:px-7">
              <div className="grid w-full max-w-[500px] grid-cols-1 gap-px overflow-hidden border border-[#1E1E32] bg-[#1E1E32] uppercase sm:grid-cols-2">
                {MENU_ITEMS.map((item) => (
                  <a
                    key={item.num}
                    href={item.href}
                    onClick={(event) => navigateTo(event, item.href, () => setMenuOpen(false))}
                    className="sticky-grid-card group flex min-h-[120px] flex-col justify-between bg-[#0D0D1A] p-5 no-underline transition-colors duration-200 hover:border hover:border-[#00E676] hover:border-dashed hover:bg-[#111128]"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-[12px] tracking-wider text-[#00E676]">
                        {item.num}
                      </span>
                      <ArrowUpRight
                        size={16}
                        className="text-[#2E2E4A] transition-colors duration-200 group-hover:text-[#00E676]"
                      />
                    </div>
                    <span className="font-display text-[16px] font-semibold leading-tight text-white">
                      {item.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const HeroNavBar = ({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean
  setMenuOpen: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <>
      <div className="hero-nav-left absolute top-0 left-0 z-30 hidden h-24 w-1/2 items-center justify-between px-[clamp(24px,5vw,80px)] opacity-0 md:flex">
        <div className="hero-badge inline-flex items-center gap-2 border border-[#00E676]/30 bg-[#00E676]/[0.06] px-3.5 py-1.5">
          <div className="pulse-dot" />
          <span className="font-mono text-[11px] tracking-[0.1em] text-[#00E676]">
            LIVE ON BAYSE MARKETS
          </span>
        </div>

        <div className="flex items-center gap-5">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="nav-social-icon text-[#5A5A7A] no-underline transition-colors duration-200 hover:text-white"
              title={social.label}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="hero-nav-right absolute top-0 right-0 z-30 w-full opacity-0 md:w-1/2">
        <div className="flex h-24 items-center justify-between px-[clamp(24px,5vw,80px)]">
          <div className="flex items-center gap-2 border border-[#00E676]/30 bg-[#00E676]/[0.06] px-3 py-1.5 md:hidden">
            <div className="pulse-dot" />
            <span className="font-mono text-[10px] tracking-[0.1em] text-[#00E676]">LIVE</span>
          </div>

          <a
            href="#marquee"
            onClick={(event) => navigateTo(event, '#marquee')}
            className="hidden items-center gap-2.5 no-underline md:flex"
          >
            <img src="/logo-mark.svg" alt="Narrative" className="h-7 w-7 shrink-0 object-contain" />
            <span className="font-brand text-[17px] font-bold uppercase tracking-[0.08em] text-white">
              Narrative
            </span>
          </a>

          <button
            onClick={() => setMenuOpen((value) => !value)}
            className="group flex cursor-pointer items-center gap-6 border border-[#1E1E32] bg-[#0D0D1A] px-4 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition-all duration-200 hover:border-2 hover:border-dashed hover:border-[#00e67774] sm:gap-20 sm:px-6 sm:py-4 sm:text-[16px]"
          >
            <span>{menuOpen ? 'Close' : 'Menu'}</span>
            <motion.div
              animate={{ rotate: menuOpen ? 90 : 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <Grid2x2XIcon size={20} className="text-[#5A5A7A] transition-colors duration-200 group-hover:text-white" />
            </motion.div>
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="flex justify-end px-[clamp(16px,5vw,80px)] pb-4">
                <div className="grid w-full max-w-[500px] grid-cols-1 gap-px overflow-hidden border border-[#1E1E32] bg-[#1E1E32] uppercase sm:grid-cols-2">
                  {MENU_ITEMS.map((item) => (
                    <a
                      key={item.num}
                      href={item.href}
                      onClick={(event) => navigateTo(event, item.href, () => setMenuOpen(false))}
                      className="hero-grid-card group flex min-h-[120px] flex-col justify-between bg-[#0D0D1A] p-5 no-underline transition-colors duration-200 hover:border hover:border-[#00E676] hover:border-dashed hover:bg-[#111128]"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-mono text-[16px] tracking-wider text-[#00E676]">
                          {item.num}
                        </span>
                        <ArrowUpRight
                          size={20}
                          className="text-[#2E2E4A] transition-colors duration-200 group-hover:text-[#00E676]"
                        />
                      </div>
                      <span className="font-display text-[18px] font-semibold leading-tight text-white sm:text-[20px]">
                        {item.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default Navbar

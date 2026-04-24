// Navbar — FractionAI full-screen overlay menu
// useGSAP for all animations, Tailwind CSS classes throughout
import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { X, Menu, ArrowRight, ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const NAV_LINKS = [
  { label: 'Build a Narrative',   href: '#start' },
  { label: 'Markets & Agents',    href: '#agents' },
  { label: 'Execution Pipeline',  href: '#pipeline' },
  { label: 'System Architecture', href: '#system' },
  { label: 'Early Access',        href: '#start' },
  { label: 'Documentation',       href: '#' },
  { label: 'About',               href: '#' },
]

const Navbar = () => {
  const barRef     = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const linksRef   = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Navbar entrance animation
  useGSAP(() => {
    gsap.fromTo(
      barRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.1 }
    )

    // Scroll border detection
    ScrollTrigger.create({
      start: 40,
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    })
  }, { scope: barRef })

  // Menu overlay animation
  useGSAP(() => {
    const overlay = overlayRef.current
    const links   = linksRef.current
    if (!overlay || !links) return

    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      gsap.set(overlay, { display: 'flex' })
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      gsap.fromTo(
        links.querySelectorAll('.nav-link-item'),
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.055, duration: 0.55, ease: 'power3.out', delay: 0.1 }
      )
    } else {
      document.body.style.overflow = ''
      gsap.to(overlay, {
        opacity: 0, duration: 0.25, ease: 'power2.in',
        onComplete: () => gsap.set(overlay, { display: 'none' }),
      })
    }
  }, { dependencies: [menuOpen] })

  return (
    <>
      {/* ── Fixed bar ─────────────────────────────────── */}
      <nav
        ref={barRef}
        className={[
          'fixed top-0 left-0 right-0 z-[100] h-16',
          'flex items-center justify-between px-7',
          'opacity-0 transition-colors duration-300',
          scrolled
            ? 'bg-[#07070F]/94 border-b border-[#1E1E32] backdrop-blur-[14px]'
            : 'bg-transparent border-b border-transparent',
        ].join(' ')}
      >
        {/* Menu toggle */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer text-white text-sm font-medium tracking-wide"
        >
          <Menu size={18} />
          <span>Menu</span>
        </button>

        {/* Center logo */}
        <a
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-mono font-bold text-[15px] text-white tracking-[0.18em] uppercase whitespace-nowrap no-underline"
        >
          Narrative
        </a>

        {/* Right CTA */}
        <a
          href="#start"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[13px] font-semibold rounded-[4px] cursor-pointer hover:bg-[#00E676] transition-colors duration-150 no-underline"
        >
          Launch App <ArrowRight size={13} />
        </a>
      </nav>

      {/* ── Full-screen overlay ──────────────────────── */}
      <div
        ref={overlayRef}
        className="hidden fixed inset-0 z-[200] bg-[#07070F] flex-col px-7"
      >
        {/* Overlay top bar */}
        <div className="h-16 flex items-center justify-between border-b border-[#1E1E32] shrink-0">
          <button
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer text-white text-sm font-medium"
          >
            <X size={18} />
            <span>Menu</span>
          </button>
          <a href="/" className="font-mono font-bold text-[15px] text-white tracking-[0.18em] uppercase no-underline">
            Narrative
          </a>
          <a
            href="#start"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[13px] font-semibold rounded-[4px] hover:bg-[#00E676] transition-colors duration-150 no-underline"
          >
            Launch App <ArrowRight size={13} />
          </a>
        </div>

        {/* Link list + right panel */}
        <div
          ref={linksRef}
          className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_320px]"
        >
          {/* Main links */}
          <div className="flex flex-col justify-center gap-0.5 border-r border-[#1E1E32] py-10">
            {NAV_LINKS.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="nav-link-item opacity-0 flex items-center gap-3 py-2.5 border-b border-[#0D0D1A] text-white no-underline tracking-tight font-bold text-[clamp(22px,3.5vw,42px)] leading-tight hover:text-[#00E676] transition-colors duration-150 group"
                onClick={() => setMenuOpen(false)}
              >
                <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0" />
                {link.label}
              </a>
            ))}
          </div>

          {/* Right meta panel */}
          <div className="hidden md:flex flex-col justify-end gap-8 p-10">
            <div>
              <div className="font-mono text-[11px] text-[#2E2E4A] tracking-[0.1em] uppercase mb-3">Status</div>
              <div className="flex items-center gap-2">
                <div className="pulse-dot" />
                <span className="font-mono text-[12px] text-[#00E676]">Live on Bayse Markets</span>
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] text-[#2E2E4A] tracking-[0.1em] uppercase mb-3">Quick links</div>
              {['Twitter / X', 'GitHub', 'Discord', 'Docs'].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="block py-2 border-b border-[#1E1E32] font-mono text-[13px] text-[#5A5A7A] no-underline hover:text-white transition-colors duration-150"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar

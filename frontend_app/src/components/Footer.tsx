import { useRef } from 'react'
import type { MouseEvent } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowUpRight, ScanLine } from 'lucide-react'
import { isInternalHashLink, scrollToTarget } from '../utils/scroll'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const SOCIAL = [
  { label: 'Twitter', href: '#' },
  { label: 'Discord', href: '#' },
  { label: 'Telegram', href: '#' },
  { label: 'Medium', href: '#' },
]

const NAV_LINKS = [
  { label: 'Hero', href: '#hero-section' },
  { label: 'Markets & Agents', href: '#agents' },
  { label: 'Pipeline', href: '#pipeline' },
  { label: 'Architecture', href: '#system' },
  { label: 'Early Access', href: '#start' },
]

const SYSTEM_LINKS = [
  'Evidence-gated thesis compiler',
  'Read-only PM approval layer',
  'Bayse venue execution routing',
  'Conviction state tracking',
]

const INFRA_STATS = [
  ['Coverage', 'Bayse CLOB + AMM'],
  ['Runtime', '24 / 7 monitoring'],
  ['Access', 'Private beta onboarding'],
]

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null)

  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isInternalHashLink(href)) return
    event.preventDefault()
    scrollToTarget(href, { offset: -72 })
  }

  useGSAP(() => {
    gsap.fromTo(
      '.footer-reveal',
      { y: 34, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.82,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 82%',
        },
      }
    )

    gsap.fromTo(
      '.footer-stat-row',
      { x: 24, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
        },
      }
    )

    gsap.to('.footer-beam', {
      xPercent: 145,
      duration: 3.8,
      repeat: -1,
      ease: 'none',
    })

    gsap.to('.footer-pulse', {
      opacity: 0.22,
      scale: 0.82,
      duration: 0.95,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }, { scope: footerRef })

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="relative overflow-hidden border-t border-[#1E1E32] bg-[radial-gradient(circle_at_bottom_left,rgba(0,230,118,0.1),transparent_28%),linear-gradient(180deg,rgba(7,7,15,0.92),rgba(5,5,8,1))]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[18%] h-[220px] w-[220px] bg-[#00E676]/[0.05] blur-[110px]" />
        <div className="absolute right-[10%] bottom-[12%] h-[260px] w-[260px] bg-[#FACC15]/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1520px] px-[clamp(24px,5vw,64px)] py-[clamp(56px,7vw,96px)]">
        <div className="mb-12 grid gap-5 border-b border-[#1E1E32] pb-10 lg:grid-cols-[1.45fr_0.85fr]">
          <div className="footer-reveal relative overflow-hidden border border-[#1E1E32] bg-[linear-gradient(180deg,rgba(15,15,28,0.96),rgba(10,10,20,0.94))] px-[clamp(24px,3vw,36px)] py-[clamp(28px,4vw,40px)] opacity-0">
            <div className="footer-beam absolute inset-x-[-40%] top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
            <div className="mb-5 inline-flex items-center gap-2 border border-[#00E676]/25 bg-[#00E676]/10 px-3 py-1">
              <div className="footer-pulse h-2 w-2 bg-[#00E676]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#00E676]">
                live infrastructure
              </span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_180px] lg:items-end">
              <div>
                <h2 className="font-display max-w-[12ch] text-[clamp(42px,5.2vw,82px)] font-black leading-[0.92] tracking-[-0.06em] text-white">
                  Build the thesis. Keep the evidence. Execute the edge.
                </h2>
                <p className="mt-6 max-w-[52ch] text-[14px] leading-[1.85] text-[#8E8EA8]">
                  Narrative gives you one operating layer for opinion, validation, planning, and execution without collapsing those responsibilities into a single unsafe agent.
                </p>
              </div>

              <div className="border-l border-[#1E1E32] pl-5">
                <div className="mb-3 flex items-center gap-3">
                  <ScanLine size={16} className="text-[#00E676]" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2E2E4A]">footer signal</span>
                </div>
                <div className="font-display text-[30px] font-bold leading-none text-white">edge</div>
                <div className="mt-3 text-[13px] leading-[1.75] text-[#8E8EA8]">
                  Thesis, research, PM, and execution remain connected but isolated by role.
                </div>
              </div>
            </div>
          </div>

          <div className="footer-reveal border border-[#1E1E32] bg-[#0A0A16]/92 opacity-0">
            {INFRA_STATS.map(([label, value], index) => (
              <div
                key={label}
                className={`footer-stat-row px-6 py-6 opacity-0 ${index < INFRA_STATS.length - 1 ? 'border-b border-[#1E1E32]' : ''}`}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2E2E4A]">{label}</div>
                <div className="font-display mt-4 text-[22px] font-bold leading-none text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-10 border-b border-[#1E1E32] pb-12 lg:grid-cols-[1.2fr_0.8fr_0.9fr_1fr]">
          <div>
            <a
              href="#hero-section"
              onClick={(event) => handleNavigate(event, '#hero-section')}
              className="mb-5 inline-flex items-center gap-3 no-underline"
            >
              <img src="/logo-mark.svg" alt="Narrative" className="h-9 w-9 shrink-0 object-contain" />
              <span className="font-brand text-[24px] font-extrabold tracking-[-0.04em] text-white">
                Narrative
              </span>
            </a>
            <p className="max-w-[30ch] text-[14px] leading-[1.8] text-[#8E8EA8]">
              Autonomous market infrastructure for teams that want their thesis, evidence, and execution path to stay connected end to end.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 border border-[#1E1E32] bg-[#0A0A16]/72 px-3 py-1.5">
              <div className="pulse-dot" />
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#00E676]">Bayse beta live</span>
            </div>
          </div>

          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#2E2E4A]">Navigate</div>
            <div className="grid gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(event) => handleNavigate(event, link.href)}
                  className="group flex items-center justify-between border border-transparent px-3 py-3 text-[15px] font-medium text-[#6A6A8A] no-underline transition-colors duration-200 hover:border-[#1E1E32] hover:bg-[#0A0A16] hover:text-white"
                >
                  <span>{link.label}</span>
                  <ArrowRight size={14} className="text-[#2E2E4A] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#2E2E4A]">System</div>
            <div className="grid gap-3">
              {SYSTEM_LINKS.map((item) => (
                <div key={item} className="border border-[#1E1E32] bg-[#0A0A16]/72 px-4 py-3 text-[13px] leading-[1.7] text-[#8E8EA8]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#2E2E4A]">Social</div>
            <div className="grid gap-2">
              {SOCIAL.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex items-center justify-between border border-transparent px-3 py-3 text-[15px] font-medium text-[#6A6A8A] no-underline transition-colors duration-200 hover:border-[#1E1E32] hover:bg-[#0A0A16] hover:text-white"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight size={14} className="text-[#2E2E4A] transition-colors duration-200 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-5 font-mono text-[11px] text-[#3A3A5A]">
            <span>Copyright {new Date().getFullYear()} Narrative Systems</span>
            <span>Privacy policy</span>
            <span>Terms and conditions</span>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#2A2A3A]">
            Built on Bayse / Powered by LangGraph
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

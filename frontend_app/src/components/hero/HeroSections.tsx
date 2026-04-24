import type { MouseEventHandler } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { HERO_HEADLINE_WORDS, ATTRIBUTES, PARTNERS, TYPING_PHRASES } from './HeroData'
import { OrbitalDiagram, PartnerLogo } from './HeroShared'

export { TYPING_PHRASES }

export const HeroLeftPanel = ({ typed }: { typed: string }) => {
  return (
    <div className="relative z-10 flex min-h-screen w-full flex-col md:w-1/2">
      <div className="h-24 shrink-0" />

      <div className="flex flex-1 flex-col justify-center px-[clamp(24px,5vw,80px)] py-10">
        <div className="hero-badge mb-8 inline-flex w-fit items-center gap-2 border border-[#00E676]/30 bg-[#00E676]/[0.06] px-3.5 py-1.5 md:hidden">
          <div className="pulse-dot" />
          <span className="font-mono text-[11px] tracking-[0.1em] text-[#00E676]">LIVE ON BAYSE</span>
        </div>

        <h1 className="mb-6">
          {HERO_HEADLINE_WORDS.map((word, index) => (
            <span key={word} className={index < HERO_HEADLINE_WORDS.length - 1 ? 'mr-[1em] inline-block' : 'inline-block'}>
              <span
                className={`hero-word font-display inline-block text-[clamp(38px,5.5vw,80px)] font-black leading-[1.05] tracking-[-0.05em] ${
                  word === 'narratives' ? 'text-[#00E676]' : 'text-white'
                }`}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero-typing mb-10 max-w-[440px] font-mono text-[clamp(12px,1.2vw,14px)] leading-[1.7] text-[#5A5A7A] opacity-0">
          {'> We turn '}
          <span className="text-[#B0B0C8]">{typed}</span>
          <span className="blink" />
        </p>

        <div className="mb-10 grid max-w-[560px] gap-4 sm:grid-cols-2">
          {ATTRIBUTES.map((attribute, index) => (
            <div
              key={attribute.letter}
              className={`hero-attr hero-attr-shell relative overflow-hidden opacity-0 ${
                index === ATTRIBUTES.length - 1 ? 'sm:col-span-2 sm:max-w-[250px]' : ''
              }`}
            >
              <div className="hero-attr-beam absolute left-[-35%] top-12 h-px w-[32%] bg-[#00E676]" />
              <div className="relative border-l border-[#2E2E4A] py-3 pl-5 pr-6 sm:pl-6 sm:pr-8">
                <span className="font-display text-[14px] font-semibold tracking-[0.04em] text-white sm:text-[15px]">
                  {attribute.label}
                </span>
              </div>
              <div className="mr-4 border-t border-[#2E2E4A] pb-2">
                <span className="hero-attr-marker inline-block font-mono text-[14px] uppercase tracking-[0.15em] text-[#2E2E4A]">
                  {attribute.letter}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-bottom-left px-[clamp(24px,5vw,80px)] pb-8 opacity-0">
        <p className="max-w-[420px] text-[14px] leading-[1.8] text-[#8E8EA8]">
          Narrative turns a market thesis into a verifiable execution path. The compiler structures it, the research layer scores it,
          and Bayse-native agents act only when the evidence holds.
        </p>
      </div>
    </div>
  )
}

export const HeroRightPanel = ({ onScrollClick }: { onScrollClick: MouseEventHandler<HTMLAnchorElement> }) => {
  const partnerItems = [...PARTNERS, ...PARTNERS]

  return (
    <div className="relative hidden min-h-screen w-1/2 flex-col bg-[#0A0A14] md:flex">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="h-24 shrink-0" />

      <div className="relative z-10 flex flex-1 items-center justify-center px-8">
        <div className="aspect-square w-full max-w-[520px]">
          <OrbitalDiagram />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between gap-4 px-[clamp(24px,5vw,80px)] pb-8">
        <div className="hero-partner-strip flex-1 overflow-hidden opacity-0">
          <div className="marquee-track flex items-center gap-0" style={{ animation: 'marquee-ltr 20s linear infinite' }}>
            {partnerItems.map((partner, index) => (
              <div key={`${partner}-${index}`} className="flex h-[36px] shrink-0 items-center gap-2.5 whitespace-nowrap border-r border-[#1A1A2E] px-5">
                <span className="text-[#3A3A5A]">
                  <PartnerLogo name={partner} />
                </span>
                <span className="font-display text-[15px] font-medium text-[#3A3A5A]">{partner}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.a
          href="#marquee"
          onClick={onScrollClick}
          whileHover={{ scale: 1.1, borderColor: '#5A5A7A' }}
          transition={{ duration: 0.2 }}
          className="hero-scroll-btn flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#2E2E4A] text-[#5A5A7A] opacity-0 transition-colors duration-200 hover:border-2 hover:border-dashed hover:border-[#00E676]! hover:text-[#00E676]! hover:text-white no-underline"
        >
          <ArrowDown size={16} />
        </motion.a>
      </div>
    </div>
  )
}

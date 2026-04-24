import { useRef, useState, useEffect } from 'react'
import type { MouseEvent } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { HeroNavBar } from './Navbar'
import { scrollToTarget } from '../utils/scroll'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* ── Data ──────────────────────────────────────────── */
const TYPING_PHRASES = [
  'market narratives into Bayse positions.',
  'evidence into executable conviction.',
  'research into live probability edges.',
  'thesis into governed execution.',
]

const ATTRIBUTES = [
  { letter: 'E', label: 'Evidence-Gated' },
  { letter: 'M', label: 'Multi-Agent' },
  { letter: 'B', label: 'Bayse Native' },
]

/* Partners with SVG logos */
const PARTNERS = [
  {
    name: 'Bayse',
    logo: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
  },
  {
    name: 'LangGraph',
    logo: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/>
        <path d="M9 6h6M6 9v6M18 9v6M9 18h6"/>
      </svg>
    ),
  },
  {
    name: 'Chainlink',
    logo: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.258 0h3.767L16.906 20.48h-3.674l-1.612-4.206H5.422L3.796 20.48H.218L6.57 3.52zM9.306 13.236l-2.39-6.248-2.345 6.248h4.735z"/>
      </svg>
    ),
  },
  {
    name: 'Dune',
    logo: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.26 16.58l2.98-3.03c.1-.1.24-.16.38-.16h14.05c.24 0 .36.29.19.46l-2.98 3.03c-.1.1-.24.16-.38.16H5.45c-.24 0-.36-.29-.19-.46z"/>
        <path d="M5.26 4.02l3.02-3.02c.1-.1.24-.16.38-.16h14.05c.24 0 .36.29.19.46L19.88 4.33c-.1.1-.24.16-.38.16H5.45c-.24 0-.36-.29-.19-.46z"/>
        <path d="M18.74 10.28l-2.98-3.03c-.1-.1-.24-.16-.38-.16H1.33c-.24 0-.36.29-.19.46l2.98 3.03c.1.1.24.16.38.16h14.05c.24 0 .36-.29.19-.46z"/>
      </svg>
    ),
  },
  {
    name: 'OpenAI',
    logo: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.042 6.042 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872v.024zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66v.018zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057v-5.58A4.504 4.504 0 0 1 13.64 2.751l-.14.083-4.764 2.749a.795.795 0 0 0-.392.681v6.598zm1.099-2.36l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
      </svg>
    ),
  },
]

/* ── Orbital SVG with labeled nodes + ROTATION ──────── */
const ORBITAL_RINGS = [
  {
    radius: 94,
    color: '#00E676',
    baseOpacity: 0.28,
    accentOpacity: 0.72,
    strokeWidth: 1.9,
    dash: '0',
    duration: 18,
    arcFraction: 0.18,
    satellites: [20, 200],
  },
  {
    radius: 162,
    color: '#B0B0C8',
    baseOpacity: 0.18,
    accentOpacity: 0.44,
    strokeWidth: 1.4,
    dash: '6 10',
    duration: 26,
    arcFraction: 0.14,
    satellites: [78, 248],
  },
  {
    radius: 228,
    color: '#FACC15',
    baseOpacity: 0.12,
    accentOpacity: 0.34,
    strokeWidth: 1.2,
    dash: '8 14',
    duration: 34,
    arcFraction: 0.11,
    satellites: [126, 302],
  },
]

const ORBITAL_NODES = [
  { radius: 94, angle: 28, label: 'Compiler', color: '#00E676' },
  { radius: 94, angle: 154, label: 'Executor', color: '#00E676' },
  { radius: 94, angle: 282, label: 'PM Agent', color: '#00E676' },
  { radius: 162, angle: 2, label: 'DAG Engine', color: '#B0B0C8' },
  { radius: 162, angle: 96, label: 'Researcher', color: '#B0B0C8' },
  { radius: 162, angle: 192, label: 'Orchestrator', color: '#B0B0C8' },
  { radius: 162, angle: 290, label: 'Validator', color: '#B0B0C8' },
  { radius: 228, angle: 48, label: 'Signals', color: '#FACC15' },
  { radius: 228, angle: 136, label: 'On-Chain', color: '#FACC15' },
  { radius: 228, angle: 224, label: 'Orderbook', color: '#FACC15' },
  { radius: 228, angle: 316, label: 'Markets', color: '#FACC15' },
]

const getOrbitPoint = (radius: number, angle: number) => {
  const rad = (angle * Math.PI) / 180
  return {
    x: Math.cos(rad) * radius,
    y: Math.sin(rad) * radius,
  }
}

const getLabelWidth = (label: string) => Math.max(90, label.length * 7.1 + 24)

const OrbitalDiagram = () => {
  return (
    <div className="relative h-full w-full">
      <motion.div
        className="absolute inset-[18%] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,230,118,0.18) 0%, rgba(0,230,118,0.05) 36%, transparent 72%)' }}
        animate={{ scale: [0.96, 1.04, 0.98], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.svg
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        viewBox="-340 -340 680 680"
        className="h-full w-full"
        fill="none"
      >
        {Array.from({ length: 9 }).map((_, i) => {
          const pos = -320 + i * 80
          return (
            <g key={`grid-${i}`}>
              <line x1={pos} y1={-320} x2={pos} y2={320} stroke="rgba(110,110,180,0.035)" strokeWidth="0.8" />
              <line x1={-320} y1={pos} x2={320} y2={pos} stroke="rgba(110,110,180,0.035)" strokeWidth="0.8" />
            </g>
          )
        })}

        <line x1={-300} y1={0} x2={300} y2={0} stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
        <line x1={0} y1={-300} x2={0} y2={300} stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />

        {ORBITAL_RINGS.map((ring, index) => {
          const circumference = 2 * Math.PI * ring.radius
          const arcLength = circumference * ring.arcFraction

          return (
            <g key={`ring-${ring.radius}`}>
              <motion.circle
                cx={0}
                cy={0}
                r={ring.radius}
                stroke={ring.color}
                strokeWidth={ring.strokeWidth}
                strokeDasharray={ring.dash}
                strokeOpacity={ring.baseOpacity}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.45 + index * 0.14, ease: 'easeInOut' }}
              />

              <motion.circle
                cx={0}
                cy={0}
                r={ring.radius}
                stroke={ring.color}
                strokeWidth={ring.strokeWidth + 0.8}
                strokeLinecap="round"
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeOpacity={ring.accentOpacity}
                animate={{ rotate: 360 }}
                transition={{ duration: ring.duration, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: 'center' }}
              />

              <motion.g
                animate={{ rotate: -360 }}
                transition={{ duration: ring.duration * 1.15, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: 'center' }}
              >
                {ring.satellites.map((angle) => (
                  <g
                    key={`${ring.radius}-${angle}`}
                    transform={`rotate(${angle}) translate(${ring.radius} 0)`}
                  >
                    <line x1={-18} y1={0} x2={-6} y2={0} stroke={ring.color} strokeOpacity={0.28} strokeWidth="1.2" />
                    <circle cx={0} cy={0} r={8} fill={`${ring.color}15`} stroke={`${ring.color}55`} strokeWidth="1" />
                    <circle cx={0} cy={0} r={3.2} fill={ring.color} />
                  </g>
                ))}
              </motion.g>
            </g>
          )
        })}

        {ORBITAL_NODES.map((node, index) => {
          const { x, y } = getOrbitPoint(node.radius, node.angle)
          const labelWidth = getLabelWidth(node.label)
          const labelHeight = 24
          const isRight = x >= 0
          const pillX = isRight ? x + 16 : x - 16 - labelWidth
          const pillY = y - labelHeight / 2

          return (
            <motion.g
              key={node.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.95 + index * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <circle cx={x} cy={y} r={11} fill={`${node.color}10`} stroke={`${node.color}40`} strokeWidth="1.2" />
              <rect
                x={x - 4}
                y={y - 4}
                width={8}
                height={8}
                fill={node.color}
                transform={`rotate(45, ${x}, ${y})`}
                opacity={0.95}
              />
              <rect
                x={pillX}
                y={pillY}
                width={labelWidth}
                height={labelHeight}
                rx={0}
                fill="rgba(9, 9, 18, 0.88)"
                stroke="rgba(46, 46, 74, 0.9)"
                strokeWidth="1"
              />
              <text
                x={pillX + 12}
                y={pillY + 15}
                fill={node.color === '#FACC15' ? '#D2B34A' : '#B0B0C8'}
                fontSize="10.5"
                fontFamily="'IBM Plex Mono', monospace"
                letterSpacing="0.06em"
              >
                {node.label}
              </text>
            </motion.g>
          )
        })}

        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.circle
            cx={0}
            cy={0}
            r={66}
            fill="#0B0B15"
            stroke="rgba(0,230,118,0.18)"
            strokeWidth="1.4"
            animate={{ scale: [1, 1.025, 1] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <circle cx={0} cy={0} r={44} fill="rgba(0,230,118,0.06)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <motion.circle
            cx={0}
            cy={0}
            r={22}
            fill="#00E676"
            fillOpacity={0.08}
            stroke="rgba(0,230,118,0.45)"
            strokeWidth="1.2"
            animate={{ scale: [0.94, 1.06, 0.94], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <text
            x={0}
            y={6}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="30"
            fontWeight="900"
            fontFamily="'Space Grotesk', sans-serif"
            letterSpacing="-0.04em"
          >
            N
          </text>
          <text
            x={0}
            y={92}
            textAnchor="middle"
            fill="#5A5A7A"
            fontSize="10.5"
            fontFamily="'IBM Plex Mono', monospace"
            letterSpacing="0.14em"
          >
            NARRATIVE CORE
          </text>
        </motion.g>
      </motion.svg>
    </div>
  )
}

/* ── Hero Component ─────────────────────────────────── */
const Hero = () => {
  const heroRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const [phraseIdx, setPhraseIdx] = useState(0)
  const [typed, setTyped] = useState('')
  const [typing, setTyping] = useState(true)

  // GSAP entrance timeline
  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 })

    // Nav elements
    tl.fromTo('.hero-nav-left', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' })
    tl.fromTo('.hero-nav-right', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4')

    // Social icons pop
    tl.fromTo('.nav-social-icon', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, stagger: 0.06, ease: 'back.out(1.7)' }, '-=0.2')

    // Grid cards stagger
    tl.fromTo('.hero-grid-card', { y: 16, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out' }, '-=0.2')

    // Vertical split line draws
    tl.fromTo('.hero-split-line', { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: 'power2.inOut' }, 0.3)

    // Heading words
    tl.fromTo('.hero-word', { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, 0.5)

    // Typing subtitle
    tl.fromTo('.hero-typing', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')

    // Attribute boxes
    tl.fromTo('.hero-attr', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' }, '-=0.2')

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

    // Bottom description
    tl.fromTo('.hero-bottom-left', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2')

    // Partner marquee
    tl.fromTo('.hero-partner-strip', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2')

    // Scroll arrow
    tl.fromTo('.hero-scroll-btn', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.2')
  }, { scope: heroRef })

  // Typing effect
  useEffect(() => {
    const phrase = TYPING_PHRASES[phraseIdx]
    let tm: ReturnType<typeof setTimeout>
    if (typing) {
      tm = typed.length < phrase.length
        ? setTimeout(() => setTyped(phrase.slice(0, typed.length + 1)), 42)
        : setTimeout(() => setTyping(false), 1800)
    } else {
      if (typed.length > 0) {
        tm = setTimeout(() => setTyped(typed.slice(0, -1)), 22)
      } else {
        setPhraseIdx((i) => (i + 1) % TYPING_PHRASES.length)
        setTyping(true)
      }
    }
    return () => clearTimeout(tm)
  }, [typed, typing, phraseIdx])

  // Build partner marquee items (doubled for seamless loop)
  const partnerItems = [...PARTNERS, ...PARTNERS]

  const handleHeroScroll = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    scrollToTarget('#marquee', { offset: -16 })
  }

  return (
    <section
      id="hero-section"
      ref={heroRef}
      className="relative flex min-h-screen overflow-hidden"
    >
      {/* ── Vertical split line ────────────────────── */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 z-20">
        <div className="hero-split-line w-full h-full bg-[#1E1E32] origin-top" style={{ transform: 'scaleY(0)' }} />
      </div>

      {/* ── Inline nav elements ────────────────────── */}
      <HeroNavBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* ── LEFT HALF ──────────────────────────────── */}
      <div className="relative z-10 flex min-h-screen w-full flex-col md:w-1/2">
        <div className="h-24 shrink-0" />

        {/* Main content */}
        <div className="flex flex-1 flex-col justify-center px-[clamp(24px,5vw,80px)] py-10">
          {/* Mobile-only badge */}
          <div className="hero-badge mb-8 inline-flex w-fit items-center gap-2 border border-[#00E676]/30 bg-[#00E676]/[0.06] px-3.5 py-1.5 md:hidden">
            <div className="pulse-dot" />
            <span className="font-mono text-[11px] text-[#00E676] tracking-[0.1em]">LIVE ON BAYSE</span>
          </div>

          {/* Heading */}
          <h1 className="mb-6">
            {['Turn', 'market', 'narratives', 'into', 'trades.'].map((word, i) => (
              <span key={i} className="inline-block mr-[1em]">
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

          {/* Typing subtitle */}
          <p className="hero-typing mb-10 max-w-[440px] font-mono text-[clamp(12px,1.2vw,14px)] leading-[1.7] text-[#5A5A7A] opacity-0">
            {'> We turn '}
            <span className="text-[#B0B0C8]">{typed}</span>
            <span className="blink" />
          </p>

          {/* Attributes (L-bracket style) */}
          <div className="mb-10 grid max-w-[560px] gap-4 sm:grid-cols-2">
            {ATTRIBUTES.map((attr, index) => (
              <div
                key={attr.letter}
                className={`hero-attr hero-attr-shell relative overflow-hidden opacity-0 ${
                  index === ATTRIBUTES.length - 1 ? 'sm:col-span-2 sm:max-w-[250px]' : ''
                }`}
              >
                <div className="hero-attr-beam absolute top-12 left-[-35%] h-px w-[32%] bg-[#00E676]" />
                <div className="relative border-l border-[#2E2E4A] py-3 pl-5 pr-6 sm:pl-6 sm:pr-8">
                  <span className="font-display text-[14px] font-semibold tracking-[0.04em] text-white sm:text-[15px]">
                    {attr.label}
                  </span>
                </div>
                <div className="mr-4 border-t border-[#2E2E4A] pb-2">
                  <span className="hero-attr-marker inline-block font-mono text-[14px] uppercase tracking-[0.15em] text-[#2E2E4A]">
                    {attr.letter}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom-left: description */}
        <div className="hero-bottom-left px-[clamp(24px,5vw,80px)] pb-8 opacity-0">
          <p className="max-w-[420px] text-[14px] leading-[1.8] text-[#8E8EA8]">
            Narrative turns a market thesis into a verifiable execution path. The compiler structures it,
            the research layer scores it, and Bayse-native agents act only when the evidence holds.
          </p>
        </div>
      </div>

      {/* ── RIGHT HALF ─────────────────────────────── */}
      <div className="hidden md:flex w-1/2 min-h-screen flex-col bg-[#0A0A14] relative">
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="h-24 shrink-0" />

        {/* Orbital diagram */}
        <div className="flex-1 flex items-center justify-center relative z-10 px-8">
          <div className="w-full max-w-[520px] aspect-square">
            <OrbitalDiagram />
          </div>
        </div>

        {/* Bottom-right: Partner logos marquee + scroll button */}
        <div className="px-[clamp(24px,5vw,80px)] pb-8 flex items-center justify-between relative z-10 gap-4">
          {/* Partner marquee */}
          <div className="hero-partner-strip flex-1 overflow-hidden opacity-0">
            <div className="marquee-track flex items-center gap-0" style={{ animation: 'marquee-ltr 20s linear infinite' }}>
              {partnerItems.map((p, i) => (
                <div key={i} className="flex items-center gap-2.5 px-5 shrink-0 whitespace-nowrap border-r border-[#1A1A2E] h-[36px]">
                  <span className="text-[#3A3A5A]">{p.logo}</span>
                  <span className="font-display text-[15px] font-medium text-[#3A3A5A]">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll-down */}
          <motion.a
            href="#marquee"
            onClick={handleHeroScroll}
            whileHover={{ scale: 1.1, borderColor: '#5A5A7A' }}
            transition={{ duration: 0.2 }}
            className="hero-scroll-btn w-11 h-11 border border-[#2E2E4A] hover:border-dashed hover:border-2 hover:text-[#00E676]! hover:border-[#00E676]! rounded-full flex items-center justify-center text-[#5A5A7A] hover:text-white transition-colors duration-200 no-underline shrink-0 opacity-0"
          >
            <ArrowDown size={16} />
          </motion.a>
        </div>
      </div>
    </section>
  )
}

export default Hero

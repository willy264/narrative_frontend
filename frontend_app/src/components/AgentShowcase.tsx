// AgentShowcase - pinned story section with direction-aware slide transitions
import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import SplitReveal from '../utils/SplitReveal'
import { ArrowRight, Bot, Search, Shield, Waypoints } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const AGENTS = [
  {
    tag: '01 / COMPILER',
    headline: 'From thesis to executable graph.',
    body: 'The Narrative Compiler turns plain-language market conviction into a structured causal graph. It challenges weak assumptions, wires in evidence rules, defines invalidation thresholds, and hands downstream agents a thesis they can actually operate.',
    detail: 'Evidence-gated compilation keeps social noise out of the graph before any agent can score, approve, or route a trade.',
    accent: '#00E676',
    icon: <Waypoints size={20} />,
    stats: [
      { label: 'Compile Time', value: '< 45s' },
      { label: 'Avg DAG Nodes', value: '4-8' },
      { label: 'Source Filters', value: '12+' },
    ],
    terminalTitle: 'compile-agent',
    terminal: [
      { text: '> Input thesis: raw market opinion', color: '#6D6E94' },
      { text: '> Evidence rules: Reuters, EDGAR only', color: '#6D6E94' },
      { text: '> Noise filter: CT influencers -> BLOCKED', color: '#6D6E94' },
      { text: '> DAG nodes: 4  Causal links: 3', color: '#6D6E94' },
      { text: '> Invalidation: Pro-DeFi bill detected', color: '#6D6E94' },
      { text: '> Confidence: HIGH', color: '#6D6E94' },
      { text: '', color: '' },
      { text: '> Status: COMPILED', color: '#00E676' },
    ],
  },
  {
    tag: '02 / RESEARCHER',
    headline: 'Truth from evidence, not noise.',
    body: 'The Researcher agent continuously scans news APIs, price oracles, and on-chain data 24/7. Each narrative node is validated against your compiled evidence rules - no guessing, only facts move the conviction score.',
    detail: 'Multi-source triangulation cross-references Reuters, Bloomberg, EDGAR filings, and on-chain analytics to validate or invalidate each thesis node.',
    accent: '#B0B0C8',
    icon: <Search size={20} />,
    stats: [
      { label: 'Sources Scanned', value: '2,400+' },
      { label: 'Update Frequency', value: '< 30s' },
      { label: 'Accuracy Rate', value: '94.7%' },
    ],
    terminalTitle: 'research-agent',
    terminal: [
      { text: '[ node_01 ] SEC Wells Notice -> RESOLVED TRUE', color: '#00E676' },
      { text: '[ node_02 ] Stablecoin outflows > $3B -> 47%', color: '#FACC15' },
      { text: '[ node_03 ] ETH drawdown -> MONITORING', color: '#6D6E94' },
      { text: '[ node_04 ] Altcoin panic -> LOCKED', color: '#6D6E94' },
      { text: '[ scan ] 2,418 sources checked -> 6 hits', color: '#6D6E94' },
      { text: '', color: '' },
      { text: '> Thesis conviction: 61% and rising', color: '#B0B0C8' },
    ],
  },
  {
    tag: '03 / PORTFOLIO MANAGER',
    headline: 'Risk-aware. Read-only. Decisive.',
    body: 'The PM agent reads live Bayse orderbooks, runs quote simulations, assesses risk exposure, and builds a full execution plan. It never writes - it only recommends.',
    detail: 'Integrates real-time depth data, fee estimation, slippage modeling, and portfolio correlation analysis before approving any trade.',
    accent: '#FACC15',
    icon: <Shield size={20} />,
    stats: [
      { label: 'Avg Decision Time', value: '1.2s' },
      { label: 'Risk Models', value: '5' },
      { label: 'Approval Rate', value: '68%' },
    ],
    terminalTitle: 'pm-agent',
    terminal: [
      { text: 'Quoting SHORT ETH -> YES @ 0.614', color: '#6D6E94' },
      { text: 'Depth: 3,200 shares available', color: '#B0B0C8' },
      { text: 'Fee est: $2.40 per 100 units', color: '#B0B0C8' },
      { text: 'Slippage: 0.3% at target size', color: '#6D6E94' },
      { text: 'Portfolio correlation: -0.12 (low)', color: '#6D6E94' },
      { text: '', color: '' },
      { text: '> Conviction: 78% -> APPROVE', color: '#FACC15' },
    ],
  },
  {
    tag: '04 / EXECUTOR',
    headline: 'Signed. Submitted. Filled.',
    body: 'The only write-capable agent. After PM approval, the Executor signs orders with HMAC authentication and submits them to Bayse AMM or CLOB markets. Then it monitors until filled.',
    detail: 'End-to-end execution with cryptographic signing, retry logic, partial fill handling, and real-time status tracking across all supported venues.',
    accent: '#00E676',
    icon: <Bot size={20} />,
    stats: [
      { label: 'Fill Rate', value: '99.2%' },
      { label: 'Avg Latency', value: '340ms' },
      { label: 'Venues', value: 'AMM + CLOB' },
    ],
    terminalTitle: 'execute-agent',
    terminal: [
      { text: 'POST /v1/pm/events/evt_882/orders', color: '#6D6E94' },
      { text: 'side: BUY | outcome: YES | amt: 500', color: '#B0B0C8' },
      { text: 'price: 0.612 | currency: USD', color: '#B0B0C8' },
      { text: 'auth: HMAC-SHA256 -> signed', color: '#6D6E94' },
      { text: '', color: '' },
      { text: '-> status: filled @ 0.611', color: '#FACC15' },
      { text: '-> orderId: ord_00019a COMPLETE', color: '#00E676' },
    ],
  },
]

// Card stacking variants — new agent slides over the old one
const panelVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 1.02,
    zIndex: 10,
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    zIndex: 1,
    transition: {
      y: { type: 'spring', damping: 30, stiffness: 150, mass: 0.8 },
      opacity: { duration: 0.3 },
      scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  },
  exit: (direction: number) => ({
    y: direction > 0 ? '-15%' : '15%',
    opacity: 0,
    scale: 0.94,
    zIndex: 0,
    transition: {
      y: { duration: 0.45, ease: 'easeInOut' },
      opacity: { duration: 0.3 },
      scale: { duration: 0.45, ease: 'easeInOut' },
    },
  }),
}

// Subtle lift for children
const childLeft = {
  enter: { opacity: 0, y: 20 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.2, ease: 'easeOut' },
  },
}

const childRight = {
  enter: { opacity: 0, y: 30 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.3, ease: 'easeOut' },
  },
}

const AgentShowcase = () => {
  const outerRef = useRef<HTMLElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [direction, setDirection] = useState(1)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      let lastIdx = 0
      const totalScroll = (AGENTS.length - 1) * window.innerHeight

      ScrollTrigger.create({
        trigger: outerRef.current,
        start: 'top top',
        end: `+=${totalScroll}`,
        pin: true,
        scrub: 0.35,
        anticipatePin: 1,
        fastScrollEnd: true,
        snap: {
          snapTo: 1 / (AGENTS.length - 1),
          duration: { min: 0.12, max: 0.28 },
          delay: 0,
        },
        onUpdate: (self) => {
          const nextIdx = Math.round(self.progress * (AGENTS.length - 1))
          if (nextIdx !== lastIdx) {
            setDirection(nextIdx > lastIdx ? 1 : -1)
            lastIdx = nextIdx
            setActiveIdx(nextIdx)
          }
        },
      })
    })

    return () => mm.revert()
  }, { scope: outerRef })

  const agent = AGENTS[activeIdx]

  return (
    <section
      id="agents"
      ref={outerRef}
      className="relative isolate overflow-hidden border-t border-[#1E1E32] bg-[radial-gradient(circle_at_top_left,rgba(0,230,118,0.08),transparent_38%),rgba(7,7,15,0.76)] lg:h-screen lg:min-h-[650px]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00E676]/30 to-transparent" />
      <div className="pointer-events-none absolute inset-y-[14%] right-[10%] w-[240px] bg-[#00E676]/[0.05] blur-[120px]" />

      <div className="relative mx-auto grid max-w-[1280px] gap-6 px-[clamp(24px,5vw,80px)] py-[clamp(56px,8vw,88px)] lg:hidden">
        <div className="max-w-[720px]">
          <div className="section-label mb-4">Agent Operating Layer</div>
          <h2 className="font-display text-[clamp(30px,9vw,50px)] font-extrabold leading-[1.02] tracking-[-0.05em] text-white">
            Four agents.
            <br />
            One governed trade path.
          </h2>
        </div>

        {AGENTS.map((item) => (
          <div
            key={item.tag}
            className="grid gap-5 border border-[#1E1E32] bg-[linear-gradient(180deg,rgba(14,14,26,0.98),rgba(10,10,22,0.95))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#1E1E32]"
                style={{ background: `${item.accent}14`, color: item.accent }}
              >
                {item.icon}
              </div>
              <div
                className="section-label border px-3 py-1.5 leading-[1.6]"
                style={{
                  color: item.accent,
                  borderColor: `${item.accent}30`,
                  background: `${item.accent}10`,
                }}
              >
                {item.tag}
              </div>
            </div>

            <div>
              <h3 className="font-display mb-3 text-[28px] font-extrabold leading-[1.04] tracking-[-0.05em] text-white">
                {item.headline}
              </h3>
              <p className="mb-4 text-[15px] leading-[1.8] text-[#B0B0C8]">
                {item.body}
              </p>
              <div className="hidden border border-[#1E1E32] bg-[#0A0A16]/80 p-4 lg:block">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#2E2E4A]">
                  Why This Agent Matters
                </div>
                <p className="text-[13px] leading-[1.8] text-[#8E8EA8]">
                  {item.detail}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-px overflow-hidden border border-[#17172A] bg-[#1E1E32] sm:grid-cols-3">
                {item.stats.map((stat) => (
                  <div key={stat.label} className="bg-[#0A0A16] px-4 py-4">
                    <span className="font-display block text-[20px] font-bold text-white">{stat.value}</span>
                    <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.1em] leading-[1.5] text-[#5A5A7A]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="hidden border border-[#17172A] bg-[#0C0C18] p-4 lg:block">
                {item.terminal.map((line, lineIndex) =>
                  line.text ? (
                    <div
                      key={lineIndex}
                      style={{ color: line.color }}
                      className={[
                        'break-words font-mono text-[12px] leading-[1.85]',
                        lineIndex === item.terminal.length - 1 ? 'font-semibold' : '',
                      ].join(' ')}
                    >
                      {line.text}
                    </div>
                  ) : (
                    <div key={lineIndex} className="h-4" />
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative hidden h-full w-full overflow-hidden lg:block">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={agent.tag}
            custom={direction}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 flex items-center px-[clamp(24px,5vw,80px)] py-[clamp(48px,6vw,80px)]"
          >
          <div className="mx-auto grid w-full max-w-[1280px] items-start gap-[clamp(32px,5vw,72px)] md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] md:items-center">
            <motion.div
              custom={direction}
              variants={childLeft}
              initial="enter"
              animate="center"
              className="order-2 flex min-w-0 flex-col gap-5 md:order-1"
            >
              <div className="overflow-hidden border border-[#1E1E32] bg-[linear-gradient(180deg,rgba(14,14,26,0.98),rgba(10,10,22,0.95))] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between border-b border-[#1E1E32] px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    {['#FF5F57', '#FEBC2E', '#28C840'].map((color) => (
                      <div key={color} className="h-3 w-3 border border-[#1E1E32]" style={{ background: color }} />
                    ))}
                    <span className="ml-1 font-mono text-[11px] tracking-[0.08em] text-[#5A5A7A]">
                      {agent.terminalTitle}
                    </span>
                  </div>
                  <span
                    className="border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em]"
                    style={{
                      color: agent.accent,
                      borderColor: `${agent.accent}44`,
                      background: `${agent.accent}12`,
                    }}
                  >
                    active
                  </span>
                </div>

                <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_148px]">
                  <div className="min-w-0 border border-[#17172A] bg-[#0C0C18] p-5">
                    {agent.terminal.map((line, lineIndex) =>
                      line.text ? (
                        <div
                          key={lineIndex}
                          style={{ color: line.color }}
                          className={[
                            'break-words font-mono text-[13px] leading-[1.95]',
                            lineIndex === agent.terminal.length - 1 ? 'font-semibold' : '',
                          ].join(' ')}
                        >
                          {line.text}
                        </div>
                      ) : (
                        <div key={lineIndex} className="h-4" />
                      )
                    )}
                  </div>

                  <div className="grid gap-px overflow-hidden border border-[#17172A] bg-[#1E1E32]">
                    {agent.stats.map((stat) => (
                      <div key={stat.label} className="bg-[#0A0A16] px-4 py-4">
                        <span className="font-display block text-[22px] font-bold text-white">{stat.value}</span>
                        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.1em] leading-[1.5] text-[#5A5A7A]">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              custom={direction}
              variants={childRight}
              initial="enter"
              animate="center"
              className="order-1 min-w-0 max-w-[560px] md:order-2"
            >
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#1E1E32]"
                  style={{ background: `${agent.accent}14`, color: agent.accent }}
                >
                  {agent.icon}
                </div>
                <div
                  className="section-label border px-3 py-1.5 leading-[1.6]"
                  style={{
                    color: agent.accent,
                    borderColor: `${agent.accent}30`,
                    background: `${agent.accent}10`,
                  }}
                >
                  {agent.tag}
                </div>
              </div>

              <SplitReveal
                key={agent.headline}
                text={agent.headline}
                as="h2"
                scrollTrigger={false}
                delay={0.04}
                stagger={0.055}
                className="font-display mb-5 text-[clamp(28px,3.2vw,48px)] font-extrabold leading-[1.02] tracking-[-0.05em] text-white"
              />

              <p className="mb-5 max-w-[52ch] text-[clamp(14px,1.3vw,16px)] leading-[1.8] text-[#B0B0C8]">
                {agent.body}
              </p>

              <div className="mb-8 border border-[#1E1E32] bg-[#0A0A16]/80 p-5">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#2E2E4A]">
                  Why This Agent Matters
                </div>
                <p className="text-[13px] leading-[1.8] text-[#8E8EA8]">
                  {agent.detail}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#start"
                  className="inline-flex items-center gap-2 border border-[#2E2E4A] bg-white px-6 py-3 text-[13px] font-semibold text-black no-underline transition-all duration-200 hover:border-white hover:bg-[#00E676]"
                >
                  Launch this flow <ArrowRight size={13} />
                </a>
                <div className="font-mono text-[11px] tracking-[0.08em] text-[#2E2E4A]">
                  Slide {String(activeIdx + 1).padStart(2, '0')} / {String(AGENTS.length).padStart(2, '0')}
                </div>
              </div>
            </motion.div>
          </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-[clamp(24px,5vw,80px)] z-30 hidden font-mono text-[11px] text-[#2E2E4A] lg:block">
        <span className="font-bold text-white">{String(activeIdx + 1).padStart(2, '0')}</span>
        <span> / {String(AGENTS.length).padStart(2, '0')}</span>
      </div>

      <div className="pointer-events-none absolute right-[clamp(16px,2vw,28px)] top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {AGENTS.map((item, index) => (
          <div key={item.tag} className="flex items-center justify-end gap-2.5">
            <span
              className="hidden w-[136px] truncate text-right font-mono text-[9px] tracking-[0.1em] transition-colors duration-300 xl:block"
              style={{ color: index === activeIdx ? item.accent : '#2E2E4A' }}
            >
              {item.tag.split(' / ')[1]}
            </span>
            <span
              className="font-mono text-[9px] tracking-[0.1em] transition-colors duration-300 xl:hidden"
              style={{ color: index === activeIdx ? item.accent : '#2E2E4A' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div
              className="h-1.5 w-1.5 rounded-full transition-all duration-300"
              style={{
                background: index === activeIdx ? item.accent : '#2E2E4A',
                transform: index === activeIdx ? 'scale(1.55)' : 'scale(1)',
              }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default AgentShowcase

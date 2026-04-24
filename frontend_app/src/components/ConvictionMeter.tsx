// ConvictionMeter — redesigned with SVG gauge, research timeline, and risk dashboard
// useGSAP + Tailwind CSS
import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import SplitReveal from '../utils/SplitReveal'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* ── Data ─────────────────────────────────────────────── */
const LOG_LINES = [
  { time: '09:14:02', text: 'Regulatory headline hits DeFi-linked market basket', score: '+8%', color: '#00E676', type: 'positive' },
  { time: '09:14:38', text: 'Stablecoin outflows cross $2.3B watch level',       score: '+5%', color: '#00E676', type: 'positive' },
  { time: '09:16:11', text: 'Social rumor on policy reversal filtered out',      score: '0%',  color: '#5A5A7A', type: 'filtered' },
  { time: '09:18:54', text: 'Reuters confirms committee delay on market-structure bill', score: '-3%', color: '#FF3B30', type: 'negative' },
  { time: '09:21:07', text: 'ETH drops 4.2% and node_03 threshold is met',      score: '+9%', color: '#00E676', type: 'positive' },
  { time: '09:23:31', text: 'Conviction threshold reached -> PM notified',       score: '+4%', color: '#FACC15', type: 'trigger' },
  { time: '09:25:12', text: 'On-chain whale movement detected (3.2K ETH)',       score: '+2%', color: '#00E676', type: 'positive' },
  { time: '09:27:44', text: 'Portfolio manager approves execution plan',         score: '--',  color: '#B0B0C8', type: 'system' },
]

const NODE_STATUS = [
  { id: '01', label: 'Regulatory enforcement headline', status: 'resolved', pct: 100 },
  { id: '02', label: 'Stablecoin outflows > $3B',      status: 'active',   pct: 47 },
  { id: '03', label: 'ETH correction > 15%',           status: 'locked',   pct: 0 },
  { id: '04', label: 'Altcoin panic cascade',          status: 'locked',   pct: 0 },
]

const TYPE_BADGES: Record<string, { label: string; bg: string; fg: string }> = {
  filtered: { label: 'FILTERED', bg: '#5A5A7A10', fg: '#5A5A7A' },
  trigger:  { label: 'TRIGGER',  bg: '#FACC1510', fg: '#FACC15' },
  system:   { label: 'SYSTEM',   bg: '#B0B0C810', fg: '#B0B0C8' },
  negative: { label: 'NEGATIVE', bg: '#FF3B3010', fg: '#FF3B30' },
}

/* ── SVG Arc Gauge ────────────────────────────────────── */
const ArcGauge = ({ score }: { score: number }) => {
  const R = 80
  const cx = 100, cy = 100
  const startAngle = 135
  const endAngle = 405
  const totalArc = endAngle - startAngle
  const circum = 2 * Math.PI * R
  const arcLength = (totalArc / 360) * circum
  const fillLength = (score / 100) * arcLength

  const describeArc = (sA: number, eA: number) => {
    const sR = (sA * Math.PI) / 180
    const eR = (eA * Math.PI) / 180
    const x1 = cx + R * Math.cos(sR)
    const y1 = cy + R * Math.sin(sR)
    const x2 = cx + R * Math.cos(eR)
    const y2 = cy + R * Math.sin(eR)
    const large = eA - sA > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`
  }

  const gaugeColor = score > 70 ? '#00E676' : score > 40 ? '#FACC15' : '#FF3B30'
  const statusText = score > 70 ? 'ACTIVE' : score > 40 ? 'MONITORING' : 'LOW'

  return (
    <div className="relative w-[200px] h-[200px]">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path
          d={describeArc(startAngle, endAngle)}
          fill="none"
          stroke="#1E1E32"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <motion.path
          d={describeArc(startAngle, endAngle)}
          fill="none"
          stroke={gaugeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${arcLength}`}
          initial={{ strokeDashoffset: arcLength }}
          whileInView={{ strokeDashoffset: arcLength - fillLength }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease: 'easeOut', delay: 0.3 }}
        />
        {Array.from({ length: 21 }).map((_, i) => {
          const pct = i / 20
          const a = ((startAngle + pct * totalArc) * Math.PI) / 180
          const inner = R - 5
          const outer = R + 4
          return (
            <line
              key={i}
              x1={cx + inner * Math.cos(a)} y1={cy + inner * Math.sin(a)}
              x2={cx + outer * Math.cos(a)} y2={cy + outer * Math.sin(a)}
              stroke={pct <= score / 100 ? `${gaugeColor}55` : '#1E1E3244'}
              strokeWidth={i % 5 === 0 ? 2 : 1}
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[36px] font-black leading-none text-white">{score}%</span>
        <span className="font-mono text-[10px] text-[#5A5A7A] tracking-[0.12em] mt-1">CONVICTION</span>
        <span className="font-mono text-[9px] mt-1 font-bold tracking-wider" style={{ color: gaugeColor }}>
          {statusText} UP
        </span>
      </div>
    </div>
  )
}

/* ── Main Component ───────────────────────────────────── */
const ConvictionMeter = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const [visibleLines, setVisibleLines] = useState(0)

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 72%',
      once: true,
      onEnter: () => {
        LOG_LINES.forEach((_, i) => {
          gsap.delayedCall(i * 0.32, () => setVisibleLines(v => v + 1))
        })
      },
    })

    // Node status cards
    gsap.fromTo('.node-card', { y: 16, opacity: 0 }, {
      y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
    })

    // Gauge scale-in
    gsap.fromTo('.gauge-wrap', { scale: 0.85, opacity: 0 }, {
      scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="how-it-thinks"
      className="border-b border-[#1E1E32] bg-[#0A0A16]
                 px-[clamp(24px,5vw,80px)] py-[clamp(64px,8vw,120px)]"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="flex justify-between items-end flex-wrap gap-6 mb-[clamp(48px,6vw,72px)]">
          <div>
            <div className="section-label mb-4">Live Intelligence</div>
            <SplitReveal
              text="How Narrative thinks."
              as="h2"
              className="font-display text-[clamp(28px,4vw,54px)] font-black leading-[1.05] tracking-[-0.05em] text-white"
            />
          </div>
          <p className="max-w-[320px] text-[14px] leading-[1.8] text-[#8E8EA8]">
            Watch in real-time as research events update conviction score and trigger autonomous execution.
          </p>
        </div>

        <div className="grid md:grid-cols-[auto_1fr_1fr] gap-6 mb-8 items-start">
          <div className="gauge-wrap opacity-0 flex flex-col items-center gap-4 bg-[#07070F] border border-[#1E1E32] p-6 rounded-sm">
            <ArcGauge score={71} />
            <div className="text-center">
              <div className="font-display text-[16px] font-semibold text-white">DeFi risk repricing</div>
              <div className="flex items-center gap-1.5 justify-center mt-1.5">
                <div className="pulse-dot" />
                <span className="font-mono text-[10px] text-[#00E676]">ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="hidden bg-[#07070F] border border-[#1E1E32] p-6 rounded-sm h-full flex-col md:flex">
            <span className="font-mono text-[10px] text-[#2E2E4A] tracking-[0.12em] uppercase mb-3">Active Thesis</span>
            <p className="flex-1 text-[14px] leading-[1.75] text-[#B0B0C8]">
              Narrative is tracking a DeFi risk-off thesis across Bayse markets. The graph weighs regulatory pressure, stablecoin flows, ETH price action, and on-chain stress signals before the execution layer can unlock.
            </p>
            <div className="flex gap-3 mt-4 pt-4 border-t border-[#1E1E32]">
              <span className="font-mono text-[10px] text-[#5A5A7A]">Age: 4h 22m</span>
              <span className="font-mono text-[10px] text-[#5A5A7A]">Sources: A+</span>
              <span className="font-mono text-[10px] text-[#5A5A7A]">Noise rejected: 14</span>
            </div>
          </div>

          <div className="hidden flex-col gap-px bg-[#1E1E32] rounded-sm overflow-hidden md:flex">
            {NODE_STATUS.map(node => {
              const statusColor = node.status === 'resolved' ? '#00E676' : node.status === 'active' ? '#FACC15' : '#2E2E4A'
              return (
                <div key={node.id} className="node-card bg-[#07070F] px-5 py-3.5 flex items-center gap-4 opacity-0">
                  <span className="font-mono text-[11px] font-bold" style={{ color: statusColor }}>{node.id}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[11px] text-[#B0B0C8] truncate">{node.label}</div>
                    <div className="w-full h-[3px] bg-[#1E1E32] mt-1.5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: statusColor }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${node.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider shrink-0" style={{ color: statusColor }}>
                    {node.status}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="terminal-window border border-[#1E1E32] bg-[#07070F] rounded-sm">
          <div className="terminal-titlebar flex items-center border-b border-[#1E1E32] px-4 py-3">
            {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
              <div key={c} className="h-2.5 w-2.5 rounded-full mr-1.5 last:mr-0" style={{ background: c }} />
            ))}
            <span className="ml-2 font-mono text-[11px] text-[#5A5A7A]">researcher-agent / live feed</span>
            <span className="ml-auto font-mono text-[10px] text-[#00E676]">LIVE</span>
          </div>
          <div className="p-4 min-h-[260px]">
            {LOG_LINES.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 border-b border-[#0D0D1A] py-2 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-4"
              >
                <span className="font-mono text-[10px] text-[#2E2E4A] shrink-0">{line.time}</span>
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  {TYPE_BADGES[line.type] && (
                    <span
                      className="font-mono text-[8px] px-1.5 py-0.5 rounded tracking-wider shrink-0"
                      style={{ background: TYPE_BADGES[line.type].bg, color: TYPE_BADGES[line.type].fg }}
                    >
                      {TYPE_BADGES[line.type].label}
                    </span>
                  )}
                  <span className="font-mono text-[12px] text-[#5A5A7A] truncate">{line.text}</span>
                </div>
                <span className="font-mono text-[12px] font-semibold shrink-0" style={{ color: line.color }}>{line.score}</span>
              </div>
            ))}
            {visibleLines < LOG_LINES.length && (
              <div className="py-3 font-mono text-[12px] text-[#2E2E4A]">
                Scanning...<span className="blink" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConvictionMeter

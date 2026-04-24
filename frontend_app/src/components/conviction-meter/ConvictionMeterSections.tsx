import { motion } from 'framer-motion'
import SplitReveal from '../../utils/SplitReveal'
import { CONVICTION_NODES, TYPE_BADGES, CONVICTION_LOG_LINES } from './ConvictionMeterData'

const ArcGauge = ({ score }: { score: number }) => {
  const radius = 80
  const cx = 100
  const cy = 100
  const startAngle = 135
  const endAngle = 405
  const totalArc = endAngle - startAngle
  const circumference = 2 * Math.PI * radius
  const arcLength = (totalArc / 360) * circumference
  const fillLength = (score / 100) * arcLength
  const gaugeColor = score > 70 ? '#00E676' : score > 40 ? '#FACC15' : '#FF3B30'
  const statusText = score > 70 ? 'ACTIVE' : score > 40 ? 'MONITORING' : 'LOW'

  const describeArc = (start: number, end: number) => {
    const startRadians = (start * Math.PI) / 180
    const endRadians = (end * Math.PI) / 180
    const x1 = cx + radius * Math.cos(startRadians)
    const y1 = cy + radius * Math.sin(startRadians)
    const x2 = cx + radius * Math.cos(endRadians)
    const y2 = cy + radius * Math.sin(endRadians)
    const largeArc = end - start > 180 ? 1 : 0

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
  }

  return (
    <div className="relative h-[200px] w-[200px]">
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <path d={describeArc(startAngle, endAngle)} fill="none" stroke="#1E1E32" strokeWidth="10" strokeLinecap="round" />
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

        {Array.from({ length: 21 }).map((_, index) => {
          const pct = index / 20
          const angle = ((startAngle + pct * totalArc) * Math.PI) / 180
          const inner = radius - 5
          const outer = radius + 4

          return (
            <line
              key={index}
              x1={cx + inner * Math.cos(angle)}
              y1={cy + inner * Math.sin(angle)}
              x2={cx + outer * Math.cos(angle)}
              y2={cy + outer * Math.sin(angle)}
              stroke={pct <= score / 100 ? `${gaugeColor}55` : '#1E1E3244'}
              strokeWidth={index % 5 === 0 ? 2 : 1}
            />
          )
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[36px] font-black leading-none text-white">{score}%</span>
        <span className="mt-1 font-mono text-[10px] tracking-[0.12em] text-[#5A5A7A]">CONVICTION</span>
        <span className="mt-1 font-mono text-[9px] font-bold tracking-wider" style={{ color: gaugeColor }}>
          {statusText} UP
        </span>
      </div>
    </div>
  )
}

const ConvictionNodeBoard = () => {
  return (
    <div className="hidden flex-col gap-px overflow-hidden rounded-sm bg-[#1E1E32] md:flex">
      {CONVICTION_NODES.map((node) => {
        const statusColor = node.status === 'resolved' ? '#00E676' : node.status === 'active' ? '#FACC15' : '#2E2E4A'

        return (
          <div key={node.id} className="node-card flex items-center gap-4 bg-[#07070F] px-5 py-3.5 opacity-0">
            <span className="font-mono text-[11px] font-bold" style={{ color: statusColor }}>
              {node.id}
            </span>

            <div className="min-w-0 flex-1">
              <div className="truncate font-mono text-[11px] text-[#B0B0C8]">{node.label}</div>
              <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-[#1E1E32]">
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

            <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider" style={{ color: statusColor }}>
              {node.status}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export const ConvictionHeader = () => {
  return (
    <div className="mb-[clamp(48px,6vw,72px)] flex flex-wrap items-end justify-between gap-6">
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
  )
}

export const ConvictionOverview = () => {
  return (
    <div className="mb-8 grid items-start gap-6 md:grid-cols-[auto_1fr_1fr]">
      <div className="gauge-wrap flex flex-col items-center gap-4 rounded-sm border border-[#1E1E32] bg-[#07070F] p-6 opacity-0">
        <ArcGauge score={71} />
        <div className="text-center">
          <div className="font-display text-[16px] font-semibold text-white">DeFi risk repricing</div>
          <div className="mt-1.5 flex items-center justify-center gap-1.5">
            <div className="pulse-dot" />
            <span className="font-mono text-[10px] text-[#00E676]">ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="hidden h-full flex-col rounded-sm border border-[#1E1E32] bg-[#07070F] p-6 md:flex">
        <span className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#2E2E4A]">Active Thesis</span>
        <p className="flex-1 text-[14px] leading-[1.75] text-[#B0B0C8]">
          Narrative is tracking a DeFi risk-off thesis across Bayse markets. The graph weighs regulatory pressure, stablecoin flows, ETH price
          action, and on-chain stress signals before the execution layer can unlock.
        </p>
        <div className="mt-4 flex gap-3 border-t border-[#1E1E32] pt-4">
          <span className="font-mono text-[10px] text-[#5A5A7A]">Age: 4h 22m</span>
          <span className="font-mono text-[10px] text-[#5A5A7A]">Sources: A+</span>
          <span className="font-mono text-[10px] text-[#5A5A7A]">Noise rejected: 14</span>
        </div>
      </div>

      <ConvictionNodeBoard />
    </div>
  )
}

export const ConvictionTerminal = ({ visibleLines }: { visibleLines: number }) => {
  return (
    <div className="terminal-window rounded-sm border border-[#1E1E32] bg-[#07070F]">
      <div className="terminal-titlebar flex items-center border-b border-[#1E1E32] px-4 py-3">
        {['#FF5F57', '#FEBC2E', '#28C840'].map((color) => (
          <div key={color} className="mr-1.5 h-2.5 w-2.5 rounded-full last:mr-0" style={{ background: color }} />
        ))}
        <span className="ml-2 font-mono text-[11px] text-[#5A5A7A]">researcher-agent / live feed</span>
        <span className="ml-auto font-mono text-[10px] text-[#00E676]">LIVE</span>
      </div>

      <div className="min-h-[260px] p-4">
        {CONVICTION_LOG_LINES.slice(0, visibleLines).map((line, index) => (
          <div
            key={`${line.time}-${index}`}
            className="flex flex-col gap-2 border-b border-[#0D0D1A] py-2 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <span className="shrink-0 font-mono text-[10px] text-[#2E2E4A]">{line.time}</span>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {TYPE_BADGES[line.type] && (
                <span
                  className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[8px] tracking-wider"
                  style={{ background: TYPE_BADGES[line.type]?.bg, color: TYPE_BADGES[line.type]?.fg }}
                >
                  {TYPE_BADGES[line.type]?.label}
                </span>
              )}
              <span className="truncate font-mono text-[12px] text-[#5A5A7A]">{line.text}</span>
            </div>
            <span className="shrink-0 font-mono text-[12px] font-semibold" style={{ color: line.color }}>
              {line.score}
            </span>
          </div>
        ))}

        {visibleLines < CONVICTION_LOG_LINES.length && (
          <div className="py-3 font-mono text-[12px] text-[#2E2E4A]">
            Scanning...<span className="blink" />
          </div>
        )}
      </div>
    </div>
  )
}

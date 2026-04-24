import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SplitReveal from '../../utils/SplitReveal'
import {
  AGENT_SHOWCASE_ITEMS,
  panelVariants,
  childLeft,
  childRight,
  type AgentShowcaseItem,
  type AgentStat,
  type AgentTerminalLine,
} from './AgentShowcaseData'

const AgentStatsGrid = ({
  layoutClassName = 'grid gap-px overflow-hidden border border-[#17172A] bg-[#1E1E32] sm:grid-cols-3',
  stats,
  valueClassName = 'text-[20px]',
}: {
  layoutClassName?: string
  stats: AgentStat[]
  valueClassName?: string
}) => {
  return (
    <div className={layoutClassName}>
      {stats.map((stat) => (
        <div key={stat.label} className="bg-[#0A0A16] px-4 py-4">
          <span className={`font-display block font-bold text-white ${valueClassName}`}>{stat.value}</span>
          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.1em] leading-[1.5] text-[#5A5A7A]">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

const AgentTerminal = ({ lines, className, textClassName }: { className: string; lines: AgentTerminalLine[]; textClassName: string }) => {
  return (
    <div className={className}>
      {lines.map((line, index) =>
        line.text ? (
          <div
            key={`${line.text}-${index}`}
            style={{ color: line.color }}
            className={[textClassName, index === lines.length - 1 ? 'font-semibold' : ''].join(' ')}
          >
            {line.text}
          </div>
        ) : (
          <div key={`spacer-${index}`} className="h-4" />
        )
      )}
    </div>
  )
}

const AgentMobileCard = ({ agent }: { agent: AgentShowcaseItem }) => {
  const Icon = agent.icon

  return (
    <div className="grid gap-5 border border-[#1E1E32] bg-[linear-gradient(180deg,rgba(14,14,26,0.98),rgba(10,10,22,0.95))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#1E1E32]" style={{ background: `${agent.accent}14`, color: agent.accent }}>
          <Icon size={20} />
        </div>
        <div
          className="section-label border px-3 py-1.5 leading-[1.6]"
          style={{ color: agent.accent, borderColor: `${agent.accent}30`, background: `${agent.accent}10` }}
        >
          {agent.tag}
        </div>
      </div>

      <div>
        <h3 className="font-display mb-3 text-[28px] font-extrabold leading-[1.04] tracking-[-0.05em] text-white">{agent.headline}</h3>
        <p className="mb-4 text-[15px] leading-[1.8] text-[#B0B0C8]">{agent.body}</p>
        <div className="hidden border border-[#1E1E32] bg-[#0A0A16]/80 p-4 lg:block">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#2E2E4A]">Why This Agent Matters</div>
          <p className="text-[13px] leading-[1.8] text-[#8E8EA8]">{agent.detail}</p>
        </div>
      </div>

      <div className="grid gap-4">
        <AgentStatsGrid stats={agent.stats} />
        <div className="hidden border border-[#17172A] bg-[#0C0C18] p-4 lg:block">
          <AgentTerminal lines={agent.terminal} className="" textClassName="break-words font-mono text-[12px] leading-[1.85]" />
        </div>
      </div>
    </div>
  )
}

export const AgentShowcaseMobile = () => {
  return (
    <div className="relative mx-auto grid max-w-[1280px] gap-6 px-[clamp(24px,5vw,80px)] py-[clamp(56px,8vw,88px)] lg:hidden">
      <div className="max-w-[720px]">
        <div className="section-label mb-4">Agent Operating Layer</div>
        <h2 className="font-display text-[clamp(30px,9vw,50px)] font-extrabold leading-[1.02] tracking-[-0.05em] text-white">
          Four agents.
          <br />
          One governed trade path.
        </h2>
      </div>

      {AGENT_SHOWCASE_ITEMS.map((agent) => (
        <AgentMobileCard key={agent.tag} agent={agent} />
      ))}
    </div>
  )
}

export const AgentShowcaseDesktop = ({
  activeIdx,
  agent,
  direction,
  totalAgents,
}: {
  activeIdx: number
  agent: AgentShowcaseItem
  direction: number
  totalAgents: number
}) => {
  const Icon = agent.icon

  return (
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
            <motion.div custom={direction} variants={childLeft} initial="enter" animate="center" className="order-2 flex min-w-0 flex-col gap-5 md:order-1">
              <div className="overflow-hidden border border-[#1E1E32] bg-[linear-gradient(180deg,rgba(14,14,26,0.98),rgba(10,10,22,0.95))] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between border-b border-[#1E1E32] px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    {['#FF5F57', '#FEBC2E', '#28C840'].map((color) => (
                      <div key={color} className="h-3 w-3 border border-[#1E1E32]" style={{ background: color }} />
                    ))}
                    <span className="ml-1 font-mono text-[11px] tracking-[0.08em] text-[#5A5A7A]">{agent.terminalTitle}</span>
                  </div>
                  <span
                    className="border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em]"
                    style={{ color: agent.accent, borderColor: `${agent.accent}44`, background: `${agent.accent}12` }}
                  >
                    active
                  </span>
                </div>

                <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_148px]">
                  <AgentTerminal
                    lines={agent.terminal}
                    className="min-w-0 border border-[#17172A] bg-[#0C0C18] p-5"
                    textClassName="break-words font-mono text-[13px] leading-[1.95]"
                  />
                  <AgentStatsGrid stats={agent.stats} valueClassName="text-[22px]" layoutClassName="grid gap-px overflow-hidden border border-[#17172A] bg-[#1E1E32]" />
                </div>
              </div>
            </motion.div>

            <motion.div custom={direction} variants={childRight} initial="enter" animate="center" className="order-1 min-w-0 max-w-[560px] md:order-2">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#1E1E32]" style={{ background: `${agent.accent}14`, color: agent.accent }}>
                  <Icon size={20} />
                </div>
                <div
                  className="section-label border px-3 py-1.5 leading-[1.6]"
                  style={{ color: agent.accent, borderColor: `${agent.accent}30`, background: `${agent.accent}10` }}
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

              <p className="mb-5 max-w-[52ch] text-[clamp(14px,1.3vw,16px)] leading-[1.8] text-[#B0B0C8]">{agent.body}</p>

              <div className="mb-8 border border-[#1E1E32] bg-[#0A0A16]/80 p-5">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#2E2E4A]">Why This Agent Matters</div>
                <p className="text-[13px] leading-[1.8] text-[#8E8EA8]">{agent.detail}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#start"
                  className="inline-flex items-center gap-2 border border-[#2E2E4A] bg-white px-6 py-3 text-[13px] font-semibold text-black no-underline transition-all duration-200 hover:border-white hover:bg-[#00E676]"
                >
                  Launch this flow <ArrowRight size={13} />
                </a>
                <div className="font-mono text-[11px] tracking-[0.08em] text-[#2E2E4A]">
                  Slide {String(activeIdx + 1).padStart(2, '0')} / {String(totalAgents).padStart(2, '0')}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export const AgentShowcaseCounter = ({ activeIdx, totalAgents }: { activeIdx: number; totalAgents: number }) => {
  return (
    <div className="pointer-events-none absolute bottom-8 left-[clamp(24px,5vw,80px)] z-30 hidden font-mono text-[11px] text-[#2E2E4A] lg:block">
      <span className="font-bold text-white">{String(activeIdx + 1).padStart(2, '0')}</span>
      <span> / {String(totalAgents).padStart(2, '0')}</span>
    </div>
  )
}

export const AgentShowcaseRail = ({ activeIdx }: { activeIdx: number }) => {
  return (
    <div className="pointer-events-none absolute right-[clamp(16px,2vw,28px)] top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
      {AGENT_SHOWCASE_ITEMS.map((item, index) => (
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
            style={{ background: index === activeIdx ? item.accent : '#2E2E4A', transform: index === activeIdx ? 'scale(1.55)' : 'scale(1)' }}
          />
        </div>
      ))}
    </div>
  )
}

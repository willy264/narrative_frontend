import { BarChart2, GitBranch, Search, Shield, Waypoints, type LucideIcon } from 'lucide-react'
import SplitReveal from '../../utils/SplitReveal'

type FeatureCard = {
  accent: string
  desc: string
  icon: LucideIcon
  id: string
  layout: string
  metric: string
  tag: string
  title: string
}

const CONTROL_FABRIC_ITEMS = [
  ['Compiler', 'Builds the causal graph'],
  ['Researcher', 'Validates live evidence'],
  ['Executor', 'Only unlocks after PM approval'],
] as const

const FEATURE_CARDS: FeatureCard[] = [
  {
    icon: Shield,
    id: '01',
    title: 'Narrative Compiler',
    desc: 'Turn raw conviction into an evidence-gated market thesis with sources, invalidation rules, and causal structure already defined.',
    tag: 'AI EDITOR',
    accent: '#00E676',
    metric: '4-8 nodes',
    layout: 'lg:col-span-2',
  },
  {
    icon: Search,
    id: '02',
    title: 'Researcher Agent',
    desc: 'Cross-checks thesis nodes against live news, price feeds, and on-chain signals without letting social noise drive the state.',
    tag: 'REAL-TIME',
    accent: '#B0B0C8',
    metric: '2,400+ scans',
    layout: 'lg:row-span-1',
  },
  {
    icon: BarChart2,
    id: '03',
    title: 'Portfolio Manager',
    desc: 'Builds a read-only execution plan with quote simulation, fee awareness, and risk-weighted conviction before any write path unlocks.',
    tag: 'READ ONLY',
    accent: '#FACC15',
    metric: '1.2s avg',
    layout: '',
  },
  {
    icon: Waypoints,
    id: '04',
    title: 'Executor Agent',
    desc: 'Signs, routes, retries, and monitors the order lifecycle across Bayse venues with state-aware execution rules.',
    tag: 'WRITE PATH',
    accent: '#00E676',
    metric: '99.2% fill',
    layout: '',
  },
  {
    icon: GitBranch,
    id: '05',
    title: 'Causal DAG Engine',
    desc: 'Every market thesis becomes a directional graph so the system always knows which event unlocks the next action.',
    tag: 'DAG LOGIC',
    accent: '#B0B0C8',
    metric: 'No loops',
    layout: '',
  },
]

const FeatureGridCard = ({ card }: { card: FeatureCard }) => {
  const Icon = card.icon

  return (
    <div
      className={[
        'feat-card group relative flex min-h-[240px] flex-col justify-between overflow-hidden border border-transparent bg-[linear-gradient(180deg,rgba(13,13,26,0.96),rgba(9,9,18,0.92))] p-[clamp(24px,3vw,34px)] opacity-0 transition-transform duration-300 hover:-translate-y-1',
        card.layout,
      ].join(' ')}
    >
      <div
        className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)` }}
      />
      <div
        className="absolute right-[-20px] top-[-20px] h-24 w-24 rounded-full opacity-0 blur-[60px] transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `${card.accent}20` }}
      />

      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#2E2E4A]" style={{ color: card.accent, background: `${card.accent}10` }}>
          <Icon size={17} />
        </div>
        <div className="text-right">
          <div className="font-mono text-[11px] text-[#2E2E4A]">{card.id}</div>
          <div className="mt-2 rounded-full border border-[#1E1E32] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: card.accent }}>
            {card.tag}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="font-display mb-3 text-[20px] font-bold tracking-[-0.03em] text-white">{card.title}</div>
        <div className="text-[14px] leading-[1.8] text-[#8E8EA8]">{card.desc}</div>
      </div>

      <div className="mt-auto">
        <div className="feat-wire mb-3 h-px w-full bg-[#1E1E32]" />
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2E2E4A]">signal</span>
          <span className="font-mono text-[11px]" style={{ color: card.accent }}>
            {card.metric}
          </span>
        </div>
      </div>
    </div>
  )
}

export const FeaturesHeader = () => {
  return (
    <div className="mb-[clamp(44px,6vw,80px)] flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-[760px]">
        <div className="section-label mb-4">System Architecture</div>
        <SplitReveal
          text="Five agents. One coordinated operating layer."
          as="h2"
          className="font-display text-[clamp(30px,4.4vw,62px)] font-black leading-[1.02] tracking-[-0.05em] text-white"
        />
      </div>

      <div className="max-w-[320px]">
        <p className="text-[14px] leading-[1.8] text-[#8E8EA8]">
          Decision-making, validation, and execution stay isolated on purpose. The visual system mirrors that separation with dedicated surfaces and status rails.
        </p>
      </div>
    </div>
  )
}

export const FeaturesHighlights = () => {
  return (
    <div className="mb-8 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="feat-card overflow-hidden rounded-[26px] border border-[#1E1E32] bg-[linear-gradient(180deg,rgba(14,14,28,0.94),rgba(10,10,18,0.92))] p-6 opacity-0">
        <div className="mb-6 flex items-center justify-between">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2E2E4A]">control fabric</div>
          <div className="rounded-full border border-[#00E676]/30 bg-[#00E676]/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#00E676]">
            online
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {CONTROL_FABRIC_ITEMS.map(([title, text]) => (
            <div key={title}>
              <div className="mb-3 h-px w-full bg-[#1E1E32]" />
              <div className="font-display mb-2 text-[18px] font-semibold text-white">{title}</div>
              <div className="text-[13px] leading-[1.75] text-[#8E8EA8]">{text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="feat-card rounded-[26px] border border-[#1E1E32] bg-[#0A0A16]/88 p-6 opacity-0">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#2E2E4A]">routing discipline</div>
        <div className="font-display mb-4 text-[26px] font-bold leading-none text-white">No agent can decide and execute in the same pass.</div>
        <div className="text-[13px] leading-[1.8] text-[#8E8EA8]">
          The orchestration layer enforces a readable handoff between thesis, evidence, planning, and trade submission.
        </div>
      </div>
    </div>
  )
}

export const FeaturesGrid = () => {
  return (
    <div className="grid auto-rows-[minmax(220px,1fr)] gap-px bg-[#1E1E32] lg:grid-cols-3">
      {FEATURE_CARDS.map((card) => (
        <FeatureGridCard key={card.id} card={card} />
      ))}
    </div>
  )
}

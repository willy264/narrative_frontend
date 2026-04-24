import type { RefObject } from 'react'
import { ArrowRight, Bot, Search, Shield, Waypoints, type LucideIcon } from 'lucide-react'

export type PipelineStep = {
  accent: string
  code: string[]
  desc: string
  features: string[]
  icon: LucideIcon
  label: string
  num: string
  stat: {
    label: string
    value: string
  }
  title: string
}

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    num: '01',
    label: 'COMPILE',
    title: 'Compile your thesis',
    desc: 'The thesis compiler turns market conviction into a structured causal graph with source rules, invalidation triggers, and clear decision boundaries.',
    features: ['Plain language input', 'Evidence-gated compilation', 'Auto invalidation rules', 'DAG visualization'],
    accent: '#00E676',
    icon: Waypoints,
    code: [
      '> Input thesis: raw market opinion',
      '> Evidence rules: Reuters, EDGAR only',
      '> Noise filter: CT influencers -> BLOCKED',
      '> DAG nodes: 4   Causal links: 3',
      '> Invalidation: Pro-DeFi bill detected',
      '> Confidence: HIGH',
      '',
      '> Status: COMPILED',
    ],
    stat: { value: '< 45s', label: 'avg compile time' },
  },
  {
    num: '02',
    label: 'RESEARCH',
    title: 'Agents watch 24 / 7',
    desc: 'The Researcher validates each node in your DAG against live news APIs, price oracles, and on-chain data continuously.',
    features: ['2,400+ sources scanned', 'Multi-source triangulation', '30s update cycles', 'Noise filtering'],
    accent: '#B0B0C8',
    icon: Search,
    code: [
      '[ node_01 ] SEC action -> RESOLVED TRUE',
      '[ node_02 ] Outflows > $3B -> 47% prob',
      '[ node_03 ] ETH drop -> MONITORING...',
      '[ node_04 ] Panic -> LOCKED',
      '',
      'Sources: Reuters OK  EDGAR OK  Bloomberg OK',
      'On-chain: Etherscan OK  Dune OK',
      '',
      'Conviction: 61% up  Status: ACTIVE',
    ],
    stat: { value: '94.7%', label: 'accuracy rate' },
  },
  {
    num: '03',
    label: 'PLAN',
    title: 'PM evaluates risk',
    desc: 'The Portfolio Manager reads live Bayse orderbooks, runs quote simulations, assesses risk, and builds a full execution plan - all in read-only mode.',
    features: ['Real-time depth analysis', 'Fee estimation', 'Slippage modeling', 'Risk correlation check'],
    accent: '#FACC15',
    icon: Shield,
    code: [
      'Quoting SHORT ETH -> YES @ 0.614',
      'Depth: 3,200 shares available',
      'Fee est: $2.40 per 100 units',
      'Slippage: 0.3% at target size',
      'Portfolio correlation: -0.12 (low)',
      '',
      'Risk score: 2.1 / 10 acceptable',
      'Conviction: 78% -> APPROVE',
    ],
    stat: { value: '1.2s', label: 'avg decision time' },
  },
  {
    num: '04',
    label: 'EXECUTE',
    title: 'Trade placed autonomously',
    desc: 'The Executor signs the order with HMAC authentication and submits it to Bayse AMM or CLOB. It then monitors until filled.',
    features: ['HMAC-SHA256 signing', 'Multi-venue routing', 'Partial fill handling', 'Real-time monitoring'],
    accent: '#00E676',
    icon: Bot,
    code: [
      'POST /v1/pm/events/evt_882/orders',
      'side: BUY | outcome: YES | amt: 500',
      'price: 0.612 | currency: USD',
      'auth: HMAC-SHA256 -> signed',
      '',
      '-> venue: CLOB best execution',
      '-> status: filled @ 0.611',
      '-> orderId: ord_00019a COMPLETE',
    ],
    stat: { value: '99.2%', label: 'fill rate' },
  },
]

export const TOTAL_PIPELINE_PANELS = PIPELINE_STEPS.length + 1

const getPipelineCodeColor = (line: string, lineIndex: number, lastIndex: number, accent: string) => {
  if (line === '') return 'transparent'
  if (lineIndex === lastIndex) return accent
  if (line.includes('OK') || line.includes('COMPLETE')) return '#00E676'
  if (line.includes('APPROVE')) return '#FACC15'

  return '#4A4A6A'
}

const PipelineFeatureList = ({ accent, features }: { accent: string; features: string[] }) => {
  return (
    <div className="mb-5 grid gap-2 sm:grid-cols-2">
      {features.map((feature) => (
        <div key={feature} className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full" style={{ background: accent }} />
          <span className="font-mono text-[11px] text-[#5A5A7A]">{feature}</span>
        </div>
      ))}
    </div>
  )
}

const PipelineTerminal = ({
  accent,
  code,
  compact = false,
}: {
  accent: string
  code: string[]
  compact?: boolean
}) => {
  const lastIndex = code.length - 1

  return (
    <div className={compact ? 'border border-[#17172A] bg-[#0B0B17] p-4' : 'rounded-[18px] border border-[#17172A] bg-[#0B0B17] p-5'}>
      {code.map((line, lineIndex) => (
        <div
          key={`${line}-${lineIndex}`}
          className={[
            compact ? 'font-mono text-[12px] leading-[1.9]' : 'font-mono text-[12px] leading-[2]',
            lineIndex === lastIndex ? 'font-semibold' : '',
          ].join(' ')}
          style={{ color: getPipelineCodeColor(line, lineIndex, lastIndex, accent) }}
        >
          {line || '\u00A0'}
        </div>
      ))}
    </div>
  )
}

const PipelineInfoGrid = ({ step, compact = false }: { step: PipelineStep; compact?: boolean }) => {
  return (
    <div className={`grid gap-px overflow-hidden border border-[#17172A] bg-[#1E1E32] ${compact ? 'sm:grid-cols-3' : 'rounded-[18px]'}`}>
      <div className="bg-[#0A0A16] px-4 py-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#2E2E4A]">signal</div>
        <div className="font-display mt-2 text-[22px] font-bold text-white">{step.stat.value}</div>
        <div className="mt-1 font-mono text-[10px] leading-[1.6] text-[#5A5A7A]">{step.stat.label}</div>
      </div>
      <div className="bg-[#0A0A16] px-4 py-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#2E2E4A]">priority</div>
        <div className="font-display mt-2 text-[18px] font-semibold text-white">{step.label}</div>
        <div className="mt-1 font-mono text-[10px] leading-[1.6] text-[#5A5A7A]">{step.features[0]}</div>
      </div>
      <div className="bg-[#0A0A16] px-4 py-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#2E2E4A]">focus</div>
        <div className="mt-2 font-mono text-[11px] leading-[1.7] text-[#B0B0C8]">{step.features[1]}</div>
      </div>
    </div>
  )
}

const PipelineMobileCard = ({ step }: { step: PipelineStep }) => {
  const Icon = step.icon

  return (
    <div className="grid gap-5 border border-[#1E1E32] bg-[linear-gradient(180deg,rgba(14,14,28,0.96),rgba(10,10,20,0.92))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center border border-[#1E1E32]" style={{ background: `${step.accent}15`, color: step.accent }}>
          <Icon size={22} />
        </div>
        <span
          className="inline-block px-2.5 py-0.5 font-mono text-[11px] tracking-[0.12em]"
          style={{ color: step.accent, border: `1px solid ${step.accent}33`, background: `${step.accent}0A` }}
        >
          {step.num} - {step.label}
        </span>
      </div>

      <div>
        <h3 className="font-display mb-3 text-[28px] font-extrabold leading-[1.06] tracking-[-0.05em] text-white">{step.title}</h3>
        <p className="mb-5 text-[15px] leading-[1.75] text-[#B0B0C8]">{step.desc}</p>
        <PipelineFeatureList accent={step.accent} features={step.features} />

        <div className="hidden items-baseline gap-3 border-l-2 pl-4 sm:flex" style={{ borderColor: step.accent }}>
          <span className="font-display text-[28px] font-bold text-white">{step.stat.value}</span>
          <span className="font-mono text-[11px] text-[#5A5A7A]">{step.stat.label}</span>
        </div>
      </div>

      <div className="hidden gap-4 lg:grid">
        <PipelineTerminal accent={step.accent} code={step.code} compact />
        <PipelineInfoGrid step={step} compact />
      </div>
    </div>
  )
}

export const PipelineMobile = () => {
  return (
    <div className="grid gap-6 px-[clamp(24px,6vw,80px)] py-[clamp(56px,8vw,88px)] md:hidden">
      <div className="max-w-[720px]">
        <div className="section-label mb-5">Execution Pipeline</div>
        <h2 className="font-display mb-6 text-[clamp(32px,10vw,48px)] font-black leading-[0.95] tracking-[-0.05em] text-white">
          Four steps.
          <br />
          Zero guesswork.
        </h2>
        <p className="mb-4 max-w-[460px] text-[15px] leading-[1.75] text-[#B0B0C8]">
          From raw market conviction to autonomous trade execution, every handoff is evidence-gated and visible.
        </p>
        <p className="max-w-[440px] text-[14px] leading-[1.8] text-[#8E8EA8]">
          On smaller screens the pipeline stacks vertically so each phase stays readable without sideways scroll.
        </p>
      </div>

      {PIPELINE_STEPS.map((step) => (
        <PipelineMobileCard key={step.num} step={step} />
      ))}
    </div>
  )
}

export const PipelineDesktop = ({ trackRef }: { trackRef: RefObject<HTMLDivElement | null> }) => {
  return (
    <div ref={trackRef} className="hidden h-screen min-h-[520px] md:flex" style={{ width: `${TOTAL_PIPELINE_PANELS * 100}vw` }}>
      <div className="h-panel flex h-full w-screen shrink-0 flex-col justify-center border-r border-[#1E1E32] px-[clamp(24px,6vw,80px)]">
        <div className="max-w-[720px]">
          <div className="h-item section-label mb-5">Execution Pipeline</div>
          <h2 className="font-display h-item mb-8 text-[clamp(40px,7vw,100px)] font-black leading-[0.95] tracking-[-0.05em] text-white">
            Four steps.
            <br />
            Zero guesswork.
          </h2>
          <p className="h-item mb-6 max-w-[460px] text-[16px] leading-[1.75] text-[#B0B0C8]">
            From raw market conviction to autonomous trade execution, every step is verifiable, evidence-gated, and fully transparent.
          </p>
          <p className="h-item mb-12 max-w-[400px] text-[14px] leading-[1.8] text-[#8E8EA8]">
            Scroll right to walk through the full agent pipeline from thesis to trade. Each step is handled by a specialized AI agent.
          </p>

          <div className="h-item mb-8 flex flex-wrap gap-3">
            {PIPELINE_STEPS.map((step) => {
              const Icon = step.icon

              return (
                <div key={step.num} className="flex items-center gap-2 border border-[#1E1E32] bg-[#0A0A16] px-3 py-1.5">
                  <span style={{ color: step.accent }}>
                    <Icon size={22} />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.08em] text-[#5A5A7A]">{step.label}</span>
                </div>
              )
            })}
          </div>

          <div className="h-item flex items-center gap-3">
            <span className="font-mono text-[12px] text-[#2E2E4A]">scroll {'->'}</span>
            <div className="h-px w-[60px] bg-[#2E2E4A]" />
          </div>
        </div>
      </div>

      {PIPELINE_STEPS.map((step, index) => {
        const Icon = step.icon

        return (
          <div
            key={step.num}
            className={`h-panel relative flex h-full w-screen shrink-0 items-center px-[clamp(24px,6vw,80px)] ${
              index < PIPELINE_STEPS.length - 1 ? 'border-r border-[#1E1E32]' : ''
            } ${index % 2 === 0 ? 'bg-[rgba(7,7,15,0.74)]' : 'bg-[rgba(10,10,22,0.78)]'}`}
          >
            <div className="mx-auto grid w-full max-w-[1040px] items-center gap-10 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              <div>
                <div className="h-item mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border border-[#1E1E32]" style={{ background: `${step.accent}15`, color: step.accent }}>
                    <Icon size={22} />
                  </div>
                  <span
                    className="inline-block px-2.5 py-0.5 font-mono text-[11px] tracking-[0.12em]"
                    style={{ color: step.accent, border: `1px solid ${step.accent}33`, background: `${step.accent}0A` }}
                  >
                    {step.num} - {step.label}
                  </span>
                </div>

                <h3 className="font-display h-item mb-4 text-[clamp(24px,3vw,40px)] font-extrabold leading-[1.15] tracking-[-0.05em] text-white">
                  {step.title}
                </h3>
                <p className="h-item mb-6 text-[15px] leading-[1.75] text-[#B0B0C8]">{step.desc}</p>

                <div className="h-item mb-6">
                  <PipelineFeatureList accent={step.accent} features={step.features} />
                </div>

                <div className="h-item flex items-baseline gap-3 border-l-2 pl-4" style={{ borderColor: step.accent }}>
                  <span className="font-display text-[28px] font-bold text-white">{step.stat.value}</span>
                  <span className="font-mono text-[11px] text-[#5A5A7A]">{step.stat.label}</span>
                </div>
              </div>

              <div className="h-item relative overflow-hidden rounded-[24px] border border-[#1E1E32] bg-[linear-gradient(180deg,rgba(14,14,28,0.96),rgba(10,10,20,0.92))] shadow-[0_26px_80px_rgba(0,0,0,0.32)]">
                <div className="absolute inset-y-8 left-0 w-px" style={{ background: `${step.accent}55` }} />

                <div className="flex items-center justify-between border-b border-[#1E1E32] px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    {['#FF5F57', '#FEBC2E', '#28C840'].map((dot) => (
                      <div key={dot} className="h-2.5 w-2.5 rounded-full" style={{ background: dot }} />
                    ))}
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#5A5A7A]">{step.label.toLowerCase()}-agent</span>
                  </div>

                  <span
                    className="rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em]"
                    style={{ color: step.accent, borderColor: `${step.accent}44`, background: `${step.accent}12` }}
                  >
                    step {step.num}
                  </span>
                </div>

                <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_148px]">
                  <PipelineTerminal accent={step.accent} code={step.code} />
                  <PipelineInfoGrid step={step} />
                </div>

                <div className="flex items-center justify-between border-t border-[#1E1E32] px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full" style={{ background: step.accent }} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5A5A7A]">execution frame aligned</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#2E2E4A]">narrative / {step.num}</span>
                </div>
              </div>
            </div>

            {index < PIPELINE_STEPS.length - 1 && (
              <div className="absolute right-8 top-1/2 flex -translate-y-1/2 items-center gap-2">
                <div className="h-px w-8" style={{ background: step.accent }} />
                <ArrowRight size={14} style={{ color: step.accent }} />
              </div>
            )}

            <div
              className="pointer-events-none absolute bottom-10 right-10 font-mono text-[#0D0D1A]"
              style={{ fontSize: 'clamp(80px,12vw,160px)', fontWeight: 900, lineHeight: 1 }}
            >
              {step.num}
            </div>
          </div>
        )
      })}
    </div>
  )
}

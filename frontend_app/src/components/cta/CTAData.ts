import { ShieldCheck, TerminalSquare, Waypoints, type LucideIcon } from 'lucide-react'

export type CTAStep = {
  accent: string
  copy: string
  id: string
  label: string
  note: string
  title: string
}

export type CTAMetric = {
  accent: string
  icon: LucideIcon
  label: string
  note: string
  value: string
}

export const CTA_STEPS: CTAStep[] = [
  {
    id: '01',
    label: 'Compile',
    title: 'Encode the market thesis',
    copy: 'Turn a market viewpoint into a causal graph with source rules, evidence thresholds, and explicit invalidation.',
    note: 'Compiler output becomes the operating graph.',
    accent: '#00E676',
  },
  {
    id: '02',
    label: 'Validate',
    title: 'Hold the graph against live evidence',
    copy: 'Research agents keep scoring the thesis against trusted news, on-chain signals, and Bayse market context in real time.',
    note: 'Only state changes move conviction.',
    accent: '#B0B0C8',
  },
  {
    id: '03',
    label: 'Route',
    title: 'Open the write path only when aligned',
    copy: 'The PM gate, research layer, and execution scope must agree on the same state before the order can leave the system.',
    note: 'Executor stays isolated until the graph says go.',
    accent: '#FACC15',
  },
]

export const CTA_METRICS: CTAMetric[] = [
  {
    label: 'Readiness',
    value: '78 / 100',
    note: 'Conviction graph synced',
    accent: '#B0B0C8',
    icon: Waypoints,
  },
  {
    label: 'Signed handoff',
    value: '340 ms',
    note: 'Median Bayse route latency',
    accent: '#00E676',
    icon: TerminalSquare,
  },
  {
    label: 'Guardrail model',
    value: 'HMAC',
    note: 'Scoped per agent role',
    accent: '#FACC15',
    icon: ShieldCheck,
  },
]

export const CTA_STATUS = [
  { label: 'Graph state', value: 'compiled', accent: '#00E676' },
  { label: 'Research layer', value: 'monitoring', accent: '#B0B0C8' },
  { label: 'PM gate', value: 'armed', accent: '#FACC15' },
  { label: 'Write path', value: 'isolated', accent: '#00E676' },
]

export const CTA_GUARDRAILS = [
  'The compiler can shape the thesis, but it cannot place orders.',
  'The PM layer stays read-only while it scores risk, slippage, and venue quality.',
  'Execution unlocks only after graph state, research state, and PM state agree.',
  'Bayse routing is selected at send time so the trade still reflects live market conditions.',
]

export const CTA_FLOW_BENEFITS = [
  ['Bayse venue aware', 'AMM + CLOB routing stays native to the final handoff.'],
  ['Readable state transitions', 'Teams can inspect why the write path is still closed or already armed.'],
  ['No hidden automation jump', 'Every move from thesis to order is explicit and reviewable.'],
] as const

export const CTA_NOTES = [
  {
    title: 'Evidence stays inspectable',
    copy: 'Every node in the launch path keeps its source logic, thresholds, and invalidation visible.',
  },
  {
    title: 'Roles stay separated',
    copy: 'Planning, validation, and submission are connected end to end without collapsing into one unsafe agent.',
  },
  {
    title: 'Bayse stays native',
    copy: 'The last handoff is built for real routing across Bayse venues instead of a mock execution surface.',
  },
]

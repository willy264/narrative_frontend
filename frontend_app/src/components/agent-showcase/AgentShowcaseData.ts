import { Bot, Search, Shield, Waypoints, type LucideIcon } from 'lucide-react'
import type { Variants } from 'framer-motion'

export type AgentTerminalLine = {
  color: string
  text: string
}

export type AgentStat = {
  label: string
  value: string
}

export type AgentShowcaseItem = {
  accent: string
  body: string
  detail: string
  headline: string
  icon: LucideIcon
  stats: AgentStat[]
  tag: string
  terminal: AgentTerminalLine[]
  terminalTitle: string
}

export const AGENT_SHOWCASE_ITEMS: AgentShowcaseItem[] = [
  {
    tag: '01 / COMPILER',
    headline: 'From thesis to executable graph.',
    body: 'The Narrative Compiler turns plain-language market conviction into a structured causal graph. It challenges weak assumptions, wires in evidence rules, defines invalidation thresholds, and hands downstream agents a thesis they can actually operate.',
    detail: 'Evidence-gated compilation keeps social noise out of the graph before any agent can score, approve, or route a trade.',
    accent: '#00E676',
    icon: Waypoints,
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
    icon: Search,
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
    icon: Shield,
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
    icon: Bot,
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

export const panelVariants: Variants = {
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
      y: { type: 'spring' as const, damping: 30, stiffness: 150, mass: 0.8 },
      opacity: { duration: 0.3 },
      scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  },
  exit: (direction: number) => ({
    y: direction > 0 ? '-15%' : '15%',
    opacity: 0,
    scale: 0.94,
    zIndex: 0,
    transition: {
      y: { duration: 0.45, ease: 'easeInOut' as const },
      opacity: { duration: 0.3 },
      scale: { duration: 0.45, ease: 'easeInOut' as const },
    },
  }),
}

export const childLeft: Variants = {
  enter: { opacity: 0, y: 20 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.2, ease: 'easeOut' as const },
  },
}

export const childRight: Variants = {
  enter: { opacity: 0, y: 30 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.3, ease: 'easeOut' as const },
  },
}

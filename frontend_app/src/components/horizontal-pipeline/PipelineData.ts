import { Search, Shield, Waypoints, Bot, type LucideIcon } from 'lucide-react'

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

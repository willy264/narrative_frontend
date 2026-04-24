import { BarChart2, GitBranch, Search, Shield, Waypoints, type LucideIcon } from 'lucide-react'

export type FeatureCard = {
  accent: string
  desc: string
  icon: LucideIcon
  id: string
  layout: string
  metric: string
  tag: string
  title: string
}

export const CONTROL_FABRIC_ITEMS = [
  ['Compiler', 'Builds the causal graph'],
  ['Researcher', 'Validates live evidence'],
  ['Executor', 'Only unlocks after PM approval'],
] as const

export const FEATURE_CARDS: FeatureCard[] = [
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

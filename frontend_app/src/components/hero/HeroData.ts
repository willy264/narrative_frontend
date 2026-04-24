export const TYPING_PHRASES = [
  'market narratives into positions.',
  'evidence into executable conviction.',
  'research into live probability edges.',
  'thesis into governed execution.',
]

export const HERO_HEADLINE_WORDS = ['Turn', 'market', 'narratives', 'into', 'trades.']

export const ATTRIBUTES = [
  { letter: 'E', label: 'Evidence-Gated' },
  { letter: 'M', label: 'Multi-Agent' },
  { letter: 'B', label: 'Bayse Native' },
]

export const PARTNERS = ['Bayse', 'LangGraph', 'Chainlink', 'Dune', 'OpenAI'] as const

export type HeroPartnerName = (typeof PARTNERS)[number]

export const ORBITAL_RINGS = [
  {
    radius: 94,
    color: '#00E676',
    baseOpacity: 0.28,
    accentOpacity: 0.72,
    strokeWidth: 1.9,
    dash: '0',
    duration: 18,
    arcFraction: 0.18,
    satellites: [20, 200],
  },
  {
    radius: 162,
    color: '#B0B0C8',
    baseOpacity: 0.18,
    accentOpacity: 0.44,
    strokeWidth: 1.4,
    dash: '6 10',
    duration: 26,
    arcFraction: 0.14,
    satellites: [78, 248],
  },
  {
    radius: 228,
    color: '#FACC15',
    baseOpacity: 0.12,
    accentOpacity: 0.34,
    strokeWidth: 1.2,
    dash: '8 14',
    duration: 34,
    arcFraction: 0.11,
    satellites: [126, 302],
  },
]

export const ORBITAL_NODES = [
  { radius: 94, angle: 28, label: 'Compiler', color: '#00E676' },
  { radius: 94, angle: 154, label: 'Executor', color: '#00E676' },
  { radius: 94, angle: 282, label: 'PM Agent', color: '#00E676' },
  { radius: 162, angle: 2, label: 'DAG Engine', color: '#B0B0C8' },
  { radius: 162, angle: 96, label: 'Researcher', color: '#B0B0C8' },
  { radius: 162, angle: 192, label: 'Orchestrator', color: '#B0B0C8' },
  { radius: 162, angle: 290, label: 'Validator', color: '#B0B0C8' },
  { radius: 228, angle: 48, label: 'Signals', color: '#FACC15' },
  { radius: 228, angle: 136, label: 'On-Chain', color: '#FACC15' },
  { radius: 228, angle: 224, label: 'Orderbook', color: '#FACC15' },
  { radius: 228, angle: 316, label: 'Markets', color: '#FACC15' },
]

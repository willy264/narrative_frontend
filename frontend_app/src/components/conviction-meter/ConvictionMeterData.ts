export type ConvictionLogType = 'filtered' | 'negative' | 'positive' | 'system' | 'trigger'

export type ConvictionLogLine = {
  color: string
  score: string
  text: string
  time: string
  type: ConvictionLogType
}

export type ConvictionNode = {
  id: string
  label: string
  pct: number
  status: 'active' | 'locked' | 'resolved'
}

export const CONVICTION_NODES: ConvictionNode[] = [
  { id: '01', label: 'Regulatory enforcement headline', status: 'resolved', pct: 100 },
  { id: '02', label: 'Stablecoin outflows > $3B', status: 'active', pct: 47 },
  { id: '03', label: 'ETH correction > 15%', status: 'locked', pct: 0 },
  { id: '04', label: 'Altcoin panic cascade', status: 'locked', pct: 0 },
]

export const TYPE_BADGES: Partial<Record<ConvictionLogType, { bg: string; fg: string; label: string }>> = {
  filtered: { label: 'FILTERED', bg: '#5A5A7A10', fg: '#5A5A7A' },
  trigger: { label: 'TRIGGER', bg: '#FACC1510', fg: '#FACC15' },
  system: { label: 'SYSTEM', bg: '#B0B0C810', fg: '#B0B0C8' },
  negative: { label: 'NEGATIVE', bg: '#FF3B3010', fg: '#FF3B30' },
}

export const CONVICTION_LOG_LINES: ConvictionLogLine[] = [
  { time: '09:14:02', text: 'Regulatory headline hits DeFi-linked market basket', score: '+8%', color: '#00E676', type: 'positive' },
  { time: '09:14:38', text: 'Stablecoin outflows cross $2.3B watch level', score: '+5%', color: '#00E676', type: 'positive' },
  { time: '09:16:11', text: 'Social rumor on policy reversal filtered out', score: '0%', color: '#5A5A7A', type: 'filtered' },
  { time: '09:18:54', text: 'Reuters confirms committee delay on market-structure bill', score: '-3%', color: '#FF3B30', type: 'negative' },
  { time: '09:21:07', text: 'ETH drops 4.2% and node_03 threshold is met', score: '+9%', color: '#00E676', type: 'positive' },
  { time: '09:23:31', text: 'Conviction threshold reached -> PM notified', score: '+4%', color: '#FACC15', type: 'trigger' },
  { time: '09:25:12', text: 'On-chain whale movement detected (3.2K ETH)', score: '+2%', color: '#00E676', type: 'positive' },
  { time: '09:27:44', text: 'Portfolio manager approves execution plan', score: '--', color: '#B0B0C8', type: 'system' },
]

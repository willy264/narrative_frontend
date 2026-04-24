// Marquee
const MARKETS_LTR = [
  { label: 'Fed cut before September FOMC',     yes: '0.62', side: 'up' },
  { label: 'BTC closes quarter above cycle high', yes: '0.57', side: 'up' },
  { label: 'ETH ETF inflows stay net positive', yes: '0.69', side: 'up' },
  { label: 'US CPI re-accelerates next print',  yes: '0.41', side: 'down' },
  { label: 'Stablecoin bill clears committee',  yes: '0.64', side: 'up' },
  { label: 'S&P 500 loses 50DMA support',       yes: '0.46', side: 'down' },
  { label: 'AI chip leader raises guidance',    yes: '0.73', side: 'up' },
  { label: 'Bayse crypto basket flips risk-on', yes: '0.66', side: 'up' },
]

const MARKETS_RTL = [
  { label: 'SOL outperforms ETH this month',     yes: '0.52', side: 'up' },
  { label: 'US jobs print misses consensus',     yes: '0.37', side: 'down' },
  { label: 'Treasury yields break lower',        yes: '0.44', side: 'down' },
  { label: 'Oil settles above breakout range',   yes: '0.58', side: 'up' },
  { label: 'Election market probability flips',  yes: '0.49', side: 'down' },
  { label: 'Prediction volume hits weekly high', yes: '0.71', side: 'up' },
  { label: 'Dollar index loses trend support',   yes: '0.39', side: 'down' },
  { label: 'Orderflow confirms thesis momentum', yes: '0.68', side: 'up' },
]

interface MarketItem { label: string; yes: string; side: string }

const Item = ({ label, yes, side }: MarketItem) => {
  const isUp = side === 'up'
  return (
    <div className="inline-flex items-center gap-4 px-8 border-r border-[#1E1E32] whitespace-nowrap h-full">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isUp ? 'bg-[#00E676]' : 'bg-[#FF3B30]'}`} />
      <span className="font-mono text-[12px] text-[#5A5A7A]">{label}</span>
      <span className={`font-mono text-[12px] font-semibold ${isUp ? 'text-[#00E676]' : 'text-[#FF3B30]'}`}>
        YES {yes}
      </span>
    </div>
  )
}

const Marquee = () => {
  const itemsLTR = [...MARKETS_LTR, ...MARKETS_LTR]
  const itemsRTL = [...MARKETS_RTL, ...MARKETS_RTL]

  return (
    <div id="marquee" className="border-t border-[#1E1E32] border-b border-b-[#1E1E32] bg-[#07070F] overflow-hidden">
      {/* Row 1 — left to right */}
      <div className="h-[44px] flex items-center overflow-hidden border-b border-[#1E1E32]">
        <div className="inline-flex items-center px-4 border-r border-[#1E1E32] h-full shrink-0 min-w-[110px]
                        font-mono text-[10px] text-[#00E676] tracking-[0.12em]">
          LIVE MKTS
        </div>
        <div className="flex-1 overflow-hidden h-full flex items-center">
          <div className="marquee-track h-full flex items-center">
            {itemsLTR.map((item, i) => <Item key={i} {...item} />)}
          </div>
        </div>
      </div>

      {/* Row 2 — right to left */}
      <div className="h-[44px] flex items-center overflow-hidden">
        <div className="inline-flex items-center px-4 border-r border-[#1E1E32] h-full shrink-0 min-w-[110px]
                        font-mono text-[10px] text-[#5A5A7A] tracking-[0.12em]">
          BAYSE FEED
        </div>
        <div className="flex-1 overflow-hidden h-full flex items-center">
          <div className="marquee-track-rtl h-full flex items-center">
            {itemsRTL.map((item, i) => <Item key={i} {...item} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Marquee

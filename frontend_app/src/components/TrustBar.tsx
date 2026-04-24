// TrustBar — brand marquee strip + premium 3-col testimonials
// useGSAP + Tailwind CSS
import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Quote } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const TESTIMONIALS = [
  { 
    quote: "Narrative turned my Bayse macro thesis into a governed execution graph in under 4 minutes. I could inspect every handoff before the trade went live.", 
    author: "0xSentinel", 
    role: "DeFi Trader | $12M AUM",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=0xSentinel"
  },
  { 
    quote: "The evidence-gating is the difference. It blocked a social rumor from mutating my probability model before the PM layer even saw it.", 
    author: "prtcl_labs", 
    role: "Quantitative Researcher",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=prtcl_labs"
  },
  { 
    quote: "I wrote a rates-and-dollar thesis in plain English and the compiler returned a six-node graph with invalidation logic in 45 seconds.", 
    author: "macro_atlas", 
    role: "Global Macro Desk",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=macro_atlas"
  },
]

const BRANDS = ['BAYSE', 'LANGGRAPH', 'REUTERS', 'EDGAR', 'DUNE', 'CHAINLINK', 'PYTH', 'ORDERBOOK FEEDS', 'ON-CHAIN SIGNALS', 'OPENAI']

const TrustBar = () => {
  const sectionRef = useRef<HTMLElement>(null)

  // useGSAP(() => {
  //   gsap.fromTo(
  //     '.trust-card',
  //     { y: 40, opacity: 0 },
  //     {
  //       y: 0, 
  //       opacity: 1, 
  //       duration: 0.8, 
  //       stagger: 0.15, 
  //       ease: 'power3.out',
  //       scrollTrigger: { 
  //         trigger: sectionRef.current, 
  //         start: 'top 75%' 
  //       },
  //     }
  //   )
  // }, { scope: sectionRef })

  // Triple the brands for seamless infinite loop
  const brandsLtr = [...BRANDS, ...BRANDS, ...BRANDS]
  const brandsRtl = [...BRANDS.slice().reverse(), ...BRANDS.slice().reverse(), ...BRANDS.slice().reverse()]

  return (
    <section ref={sectionRef} className="border-b border-[#1E1E32] bg-[#07070F] overflow-hidden">
      {/* Marquee Row 1 — Left to Right */}
      <div className="border-b border-[#1E1E32] h-[48px] flex items-center overflow-hidden bg-[#0A0A16]/50">
        <div className="inline-flex items-center px-6 border-r border-[#1E1E32] h-full shrink-0 min-w-[130px] font-mono text-[10px] text-[#00E676] tracking-[0.2em] uppercase bg-[#0A0A16]">
          Partners
        </div>
        <div className="flex-1 overflow-hidden h-full flex items-center">
          <div className="marquee-track h-full flex items-center">
            {brandsLtr.map((b, i) => (
              <div
                key={i}
                className="px-10 border-r border-[#1E1E32] h-full flex items-center
                           font-mono text-[10px] text-[#5A5A7A] tracking-[0.15em] whitespace-nowrap shrink-0 hover:text-white transition-colors duration-200"
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee Row 2 — Right to Left */}
      <div className="border-b border-[#1E1E32] h-[48px] flex items-center overflow-hidden bg-[#07070F]">
        <div className="inline-flex items-center px-6 border-r border-[#1E1E32] h-full shrink-0 min-w-[130px] font-mono text-[10px] text-[#5A5A7A] tracking-[0.2em] uppercase bg-[#07070F]">
          Integrations
        </div>
        <div className="flex-1 overflow-hidden h-full flex items-center">
          <div className="marquee-track-rtl h-full flex items-center">
            {brandsRtl.map((b, i) => (
              <div
                key={i}
                className="px-10 border-r border-[#1E1E32] h-full flex items-center
                           font-mono text-[10px] text-[#2E2E4A] tracking-[0.15em] whitespace-nowrap shrink-0 hover:text-[#5A5A7A] transition-colors duration-200"
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-[1400px] mx-auto px-[clamp(24px,5vw,80px)] py-[clamp(80px,10vw,140px)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 md:mb-24">
          <div className="max-w-2xl">
            <div className="section-label mb-6">Testimonials</div>
            <h2 className="font-display text-[clamp(32px,4vw,56px)] font-black leading-tight tracking-[-0.05em] text-white">
              Used by teams who <span className="text-[#00E676]">trade the thesis.</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="font-mono text-[11px] text-[#5A5A7A] tracking-[0.1em] uppercase">Status: Private beta live</span>
            <span className="font-mono text-[11px] text-white/50">1,200+ Bayse-ready theses compiled</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="group relative flex flex-col"
            >
              {/* Card Decoration */}
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t border-l border-[#1E1E32] group-hover:border-[#00E676]/30 transition-colors duration-300 pointer-events-none" />
              
              <div className="px-2 mb-8">
                <Quote className="text-[#1E1E32] group-hover:text-[#00E676]/20 transition-colors duration-500 mb-6" size={32} />
                <p className="text-[clamp(16px,1.2vw,19px)] font-medium italic leading-[1.8] text-[#B0B0C8]">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-auto pt-8 border-t border-[#1E1E32] flex items-center gap-4">
                <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full border border-[#1E1E32] bg-[#0A0A16]" />
                <div>
                  <div className="font-mono text-[13px] text-white font-bold leading-none mb-1.5">{t.author}</div>
                  <div className="font-mono text-[10px] text-[#5A5A7A] tracking-wider uppercase leading-none">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustBar

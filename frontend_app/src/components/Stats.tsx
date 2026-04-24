// Stats — react-odometerjs count-up on scroll
// useGSAP for scroll trigger, Tailwind CSS
import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Odometer from 'react-odometerjs'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const STATS = [
  { label: 'TRADES ROUTED',         value: 18320, suffix: '+' },
  { label: 'THESIS GRAPHS BUILT',   value: 2841,  suffix: '+' },
  { label: 'PM APPROVAL RATE',      value: 68,    suffix: '%' },
  { label: 'BAYSE MARKETS TRACKED', value: 340,   suffix: '+' },
]

const StatItem = ({
  label, value, suffix, index, isLast,
}: {
  label: string; value: number; suffix: string; index: number; isLast: boolean
}) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  // useGSAP with ScrollTrigger to trigger count-up
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.delayedCall(index * 0.12, () => setCount(value))
      },
    })
  }, { scope: ref })

  return (
    <div
      ref={ref}
      className={[
        'border-b border-[#1E1E32] px-[clamp(24px,4vw,34px)] py-[clamp(40px,5vw,72px)]',
        isLast ? '' : 'border-r border-r-[#1E1E32]',
      ].join(' ')}
    >
      {/* Number row */}
      <div
        className="font-display mb-3 flex items-baseline gap-1 leading-none text-white"
        style={{ fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '-0.09em' }}
      >
        <Odometer
          value={count}
          format="(,ddd)"
          theme="minimal"
          style={{ fontFamily: 'inherit', fontWeight: 'inherit', fontSize: 'inherit', overflow: 'visible' }}
        />
        <span>{suffix}</span>
      </div>

      {/* Label */}
      <div className="font-mono text-[11px] tracking-[0.1em] text-[#5A5A7A] uppercase">
        {label}
      </div>
    </div>
  )
}

const Stats = () => {
  return (
    <section className="border-b border-[#1E1E32] bg-[#0A0A16]">
      <div className="stats-grid max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <StatItem
            key={i}
            index={i}
            isLast={i === STATS.length - 1}
            {...stat}
          />
        ))}
      </div>
    </section>
  )
}

export default Stats

import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  AGENT_SHOWCASE_ITEMS,
  AgentShowcaseCounter,
  AgentShowcaseDesktop,
  AgentShowcaseMobile,
  AgentShowcaseRail,
} from './agent-showcase/AgentShowcaseSections'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const AgentShowcase = () => {
  const outerRef = useRef<HTMLElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [direction, setDirection] = useState(1)

  useGSAP(() => {
    const media = gsap.matchMedia()

    media.add('(min-width: 1024px)', () => {
      let lastIdx = 0
      const totalScroll = (AGENT_SHOWCASE_ITEMS.length - 1) * window.innerHeight

      ScrollTrigger.create({
        trigger: outerRef.current,
        start: 'top top',
        end: `+=${totalScroll}`,
        pin: true,
        scrub: 0.35,
        anticipatePin: 1,
        fastScrollEnd: true,
        snap: {
          snapTo: 1 / (AGENT_SHOWCASE_ITEMS.length - 1),
          duration: { min: 0.12, max: 0.28 },
          delay: 0,
        },
        onUpdate: (self) => {
          const nextIdx = Math.round(self.progress * (AGENT_SHOWCASE_ITEMS.length - 1))

          if (nextIdx !== lastIdx) {
            setDirection(nextIdx > lastIdx ? 1 : -1)
            lastIdx = nextIdx
            setActiveIdx(nextIdx)
          }
        },
      })
    })

    return () => media.revert()
  }, { scope: outerRef })

  const activeAgent = AGENT_SHOWCASE_ITEMS[activeIdx]

  return (
    <section
      id="agents"
      ref={outerRef}
      className="relative isolate overflow-hidden border-t border-[#1E1E32] bg-[radial-gradient(circle_at_top_left,rgba(0,230,118,0.08),transparent_38%),rgba(7,7,15,0.76)] lg:h-screen lg:min-h-[650px]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00E676]/30 to-transparent" />
      <div className="pointer-events-none absolute inset-y-[14%] right-[10%] w-[240px] bg-[#00E676]/[0.05] blur-[120px]" />

      <AgentShowcaseMobile />
      <AgentShowcaseDesktop
        activeIdx={activeIdx}
        agent={activeAgent}
        direction={direction}
        totalAgents={AGENT_SHOWCASE_ITEMS.length}
      />
      <AgentShowcaseCounter activeIdx={activeIdx} totalAgents={AGENT_SHOWCASE_ITEMS.length} />
      <AgentShowcaseRail activeIdx={activeIdx} />
    </section>
  )
}

export default AgentShowcase

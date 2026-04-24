import { useRef } from 'react'
import type { MouseEvent } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Waypoints,
} from 'lucide-react'
import { scrollToTarget } from '../utils/scroll'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const CTA_STEPS = [
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

const CTA_METRICS = [
  {
    label: 'Readiness',
    value: '78 / 100',
    note: 'Conviction graph synced',
    accent: '#B0B0C8',
    icon: <Waypoints size={18} />,
  },
  {
    label: 'Signed handoff',
    value: '340 ms',
    note: 'Median Bayse route latency',
    accent: '#00E676',
    icon: <TerminalSquare size={18} />,
  },
  {
    label: 'Guardrail model',
    value: 'HMAC',
    note: 'Scoped per agent role',
    accent: '#FACC15',
    icon: <ShieldCheck size={18} />,
  },
]

const CTA_STATUS = [
  { label: 'Graph state', value: 'compiled', accent: '#00E676' },
  { label: 'Research layer', value: 'monitoring', accent: '#B0B0C8' },
  { label: 'PM gate', value: 'armed', accent: '#FACC15' },
  { label: 'Write path', value: 'isolated', accent: '#00E676' },
]

const CTA_GUARDRAILS = [
  'The compiler can shape the thesis, but it cannot place orders.',
  'The PM layer stays read-only while it scores risk, slippage, and venue quality.',
  'Execution unlocks only after graph state, research state, and PM state agree.',
  'Bayse routing is selected at send time so the trade still reflects live market conditions.',
]

const CTA_NOTES = [
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

const CTA = () => {
  const sectionRef = useRef<HTMLElement>(null)

  const handleScroll = (event: MouseEvent<HTMLAnchorElement>, target: string) => {
    event.preventDefault()
    scrollToTarget(target, { offset: -72 })
  }

  useGSAP(() => {
    gsap.fromTo(
      '.cta-reveal',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.82,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
        },
      }
    )

    gsap.fromTo(
      '.cta-step',
      { x: -28, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.62,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
        },
      }
    )

    gsap.fromTo(
      '.cta-status-row',
      { x: 18, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.06,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
        },
      }
    )

    gsap.to('.cta-scan-line', {
      xPercent: 145,
      duration: 4.2,
      repeat: -1,
      ease: 'none',
    })

    gsap.to('.cta-signal-dot', {
      opacity: 0.28,
      scale: 0.7,
      duration: 0.9,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.12,
    })
  }, { scope: sectionRef })

  return (
    <section
      id="start"
      ref={sectionRef}
      className="relative overflow-hidden border-y border-[#1E1E32] bg-[linear-gradient(180deg,rgba(8,8,16,0.96),rgba(5,5,10,1))] px-[clamp(24px,5vw,80px)] py-[clamp(92px,11vw,168px)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />
        <div className="absolute left-[-4%] top-[10%] h-[280px] w-[280px] bg-[#00E676]/[0.08] blur-[130px]" />
        <div className="absolute right-[-2%] top-[18%] h-[340px] w-[340px] bg-[#FACC15]/[0.05] blur-[150px]" />
        <div className="absolute left-[16%] bottom-[10%] h-[220px] w-[220px] bg-[#B0B0C8]/[0.05] blur-[120px]" />
        <div className="absolute inset-x-[12%] top-0 h-px bg-gradient-to-r from-transparent via-[#00E676]/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1540px]">
        <div className="cta-reveal mb-10 flex flex-col gap-4 border-b border-[#1E1E32] pb-6 opacity-0 md:flex-row md:items-end md:justify-between">
          <div className="inline-flex items-center gap-3 border border-[#00E676]/25 bg-[#00E676]/10 px-3.5 py-1.5">
            <Sparkles size={14} className="text-[#00E676]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#00E676]">
              governed launch surface
            </span>
          </div>

          <div className="max-w-[520px] text-[13px] leading-[1.75] text-[#8E8EA8] md:text-right">
            This is the final handoff zone: conviction is already structured, monitored, and ready to route when Bayse execution conditions line up.
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
          <div className="grid min-w-0 gap-6">
            <div className="cta-reveal relative overflow-hidden border border-[#1E1E32] bg-[linear-gradient(135deg,rgba(12,12,24,0.96),rgba(8,8,16,0.94))] p-[clamp(28px,4vw,52px)] opacity-0">
              <div className="absolute right-0 top-0 h-[180px] w-[180px] border-b border-l border-[#1E1E32]/70" />
              <div className="absolute bottom-0 right-[18%] top-0 w-px bg-[linear-gradient(180deg,transparent,rgba(46,46,74,0.9),transparent)]" />

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
                <div className="min-w-0">
                  <div className="cta-reveal mb-6 inline-flex items-center gap-2 border border-[#2E2E4A] bg-[#0B0B15]/90 px-3 py-1 opacity-0">
                    <div className="cta-signal-dot h-2 w-2 bg-[#00E676]" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B0B0C8]">
                      bayse write path stays locked until proof arrives
                    </span>
                  </div>

                  <h2 className="cta-reveal font-display text-[clamp(40px,6.8vw,104px)] font-black leading-[0.9] tracking-[-0.065em] text-white opacity-0">
                    Move from
                    <span className="block text-[#00E676]">narrative to trade</span>
                    <span className="block text-[#B0B0C8]">without dropping the guardrails.</span>
                  </h2>

                  <p className="cta-reveal mt-8 max-w-[620px] text-[clamp(14px,1.2vw,17px)] leading-[1.9] text-[#8E8EA8] opacity-0">
                    Narrative compiles the worldview, keeps the evidence graph hot, and arms Bayse execution only when the thesis state still holds. The CTA now reads like the product because it is the product.
                  </p>

                  <div className="cta-reveal mt-10 flex flex-wrap items-center gap-4 opacity-0">
                    <a
                      href="#footer"
                      onClick={(event) => handleScroll(event, '#footer')}
                      className="group inline-flex items-center gap-3 border border-[#00E676] bg-[#00E676] px-8 py-4 text-[14px] font-bold text-black no-underline transition-colors duration-200 hover:bg-[#00c867]"
                    >
                      Request Beta Access
                      <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </a>

                    <a
                      href="#pipeline"
                      onClick={(event) => handleScroll(event, '#pipeline')}
                      className="group inline-flex items-center gap-3 border border-[#2A2A42] bg-[#0C0C18]/90 px-8 py-4 text-[14px] font-semibold text-white no-underline transition-colors duration-200 hover:border-[#B0B0C8] hover:bg-[#111123]"
                    >
                      See The Launch Path
                      <ArrowUpRight size={16} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </div>

                  <div className="cta-reveal mt-10 flex flex-wrap gap-3 opacity-0">
                    {CTA_STEPS.map((step) => (
                      <div key={step.id} className="inline-flex items-center gap-2 border border-[#1E1E32] bg-[#090913]/80 px-3 py-1.5">
                        <span className="font-mono text-[10px] tracking-[0.14em]" style={{ color: step.accent }}>
                          {step.id}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#5A5A7A]">
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-px overflow-hidden border border-[#1E1E32] bg-[#1E1E32]">
                  <div className="bg-[#090913] px-4 py-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2E2E4A]">current mode</div>
                    <div className="font-display mt-2 text-[30px] font-bold leading-none text-white">armed</div>
                    <div className="mt-2 text-[12px] leading-[1.7] text-[#8E8EA8]">
                      Waiting on final evidence agreement before the Bayse route can open.
                    </div>
                  </div>
                  <div className="bg-[#090913] px-4 py-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2E2E4A]">deployment bias</div>
                    <div className="mt-2 font-mono text-[12px] uppercase tracking-[0.12em] text-[#B0B0C8]">
                      evidence first / role separated / bayse native
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="cta-reveal relative overflow-hidden border border-[#1E1E32] bg-[linear-gradient(180deg,rgba(12,12,22,0.95),rgba(8,8,14,0.96))] p-[clamp(24px,3vw,34px)] opacity-0">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="section-label">Launch Path</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2E2E4A]">
                    3 state changes to execution
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute bottom-2 left-[18px] top-2 w-px bg-[#1E1E32]" />

                  <div className="grid gap-4">
                    {CTA_STEPS.map((step, index) => (
                      <div
                        key={step.id}
                        className="cta-step relative opacity-0"
                        style={{ marginLeft: `${index * 14}px` }}
                      >
                        <div className="grid gap-3 border border-[#1E1E32] bg-[#090913]/92 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.16)]">
                          <div className="flex items-start gap-3">
                            <div
                              className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center border text-[11px] font-bold"
                              style={{
                                color: step.accent,
                                borderColor: `${step.accent}44`,
                                background: `${step.accent}14`,
                              }}
                            >
                              {step.id}
                            </div>

                            <div className="min-w-0">
                              <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#5A5A7A]">
                                {step.label}
                              </div>
                              <h3 className="font-display text-[22px] font-bold leading-[1.05] tracking-[-0.04em] text-white">
                                {step.title}
                              </h3>
                            </div>
                          </div>

                          <p className="pl-12 text-[14px] leading-[1.8] text-[#8E8EA8]">
                            {step.copy}
                          </p>

                          <div className="pl-12 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: step.accent }}>
                            {step.note}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="cta-reveal overflow-hidden border border-[#1E1E32] bg-[#0A0A16]/92 opacity-0">
                <div className="border-b border-[#1E1E32] px-5 py-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2E2E4A]">
                    Why teams use this flow
                  </div>
                </div>

                <div className="grid gap-px bg-[#1E1E32]">
                  {[
                    ['Bayse venue aware', 'AMM + CLOB routing stays native to the final handoff.'],
                    ['Readable state transitions', 'Teams can inspect why the write path is still closed or already armed.'],
                    ['No hidden automation jump', 'Every move from thesis to order is explicit and reviewable.'],
                  ].map(([title, copy]) => (
                    <div key={title} className="bg-[#090913] px-5 py-4">
                      <div className="font-display text-[18px] font-semibold leading-none text-white">{title}</div>
                      <div className="mt-2 text-[13px] leading-[1.75] text-[#8E8EA8]">{copy}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="cta-reveal relative overflow-hidden border border-[#1E1E32] bg-[linear-gradient(180deg,rgba(14,14,28,0.98),rgba(8,8,16,0.98))] opacity-0">
            <div className="cta-scan-line absolute inset-x-[-45%] top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

            <div className="border-b border-[#1E1E32] px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {['#FF5F57', '#FEBC2E', '#28C840'].map((dot) => (
                    <div key={dot} className="h-2.5 w-2.5 border border-[#1E1E32]" style={{ background: dot }} />
                  ))}
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#5A5A7A]">
                    launch-control
                  </span>
                </div>

                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#00E676]">
                  bayse beta
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_120px] sm:items-end">
                <div>
                  <div className="section-label mb-3">Write Path Status</div>
                  <div className="font-display text-[clamp(46px,5vw,76px)] font-black leading-[0.92] tracking-[-0.065em] text-white">
                    ARMED
                  </div>
                  <p className="mt-3 max-w-[28ch] text-[14px] leading-[1.8] text-[#8E8EA8]">
                    The system is ready to route as soon as the remaining evidence checks and PM constraints stay aligned.
                  </p>
                </div>

                <div className="border border-[#2E2E4A] bg-[#090913]/90 px-4 py-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2E2E4A]">
                    readiness
                  </div>
                  <div className="font-display mt-2 text-[34px] font-black leading-none text-white">78</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#B0B0C8]">
                    of 100
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-px bg-[#1E1E32] sm:grid-cols-3">
              {CTA_METRICS.map((card) => (
                <div key={card.label} className="bg-[#090913] px-5 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center border border-[#1E1E32]"
                      style={{ color: card.accent, background: `${card.accent}12` }}
                    >
                      {card.icon}
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#2E2E4A]">
                      {card.label}
                    </span>
                  </div>
                  <div className="font-display text-[28px] font-bold leading-none text-white">{card.value}</div>
                  <div className="mt-2 text-[13px] leading-[1.75] text-[#8E8EA8]">{card.note}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#1E1E32] px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2E2E4A]">runtime state</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#B0B0C8]">live agreement model</span>
              </div>

              <div className="grid gap-px overflow-hidden border border-[#1E1E32] bg-[#1E1E32]">
                {CTA_STATUS.map((row) => (
                  <div key={row.label} className="cta-status-row flex items-center justify-between bg-[#090913] px-4 py-3 opacity-0">
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5A5A7A]">
                      {row.label}
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: row.accent }}>
                        {row.value}
                      </span>
                      <div className="cta-signal-dot h-2 w-2" style={{ background: row.accent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#1E1E32] bg-[#090913]/94 px-6 py-6">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[#2E2E4A]">
                guardrails before execution
              </div>

              <div className="grid gap-3">
                {CTA_GUARDRAILS.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-[#00E676]/35 bg-[#00E676]/10 text-[#00E676]">
                      <Check size={12} />
                    </div>
                    <p className="text-[13px] leading-[1.8] text-[#8E8EA8]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="cta-reveal mt-8 grid gap-px overflow-hidden border border-[#1E1E32] bg-[#1E1E32] opacity-0 md:grid-cols-3">
          {CTA_NOTES.map((item) => (
            <div key={item.title} className="bg-[#090913] px-5 py-5">
              <div className="font-display text-[20px] font-semibold tracking-[-0.03em] text-white">
                {item.title}
              </div>
              <div className="mt-2 text-[13px] leading-[1.8] text-[#8E8EA8]">
                {item.copy}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CTA

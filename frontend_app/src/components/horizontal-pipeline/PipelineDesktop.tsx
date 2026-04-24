import type { RefObject } from 'react'
import { ArrowRight } from 'lucide-react'
import { PIPELINE_STEPS, TOTAL_PIPELINE_PANELS } from './PipelineData'
import { PipelineFeatureList, PipelineTerminal, PipelineInfoGrid } from './PipelineShared'

export const PipelineDesktop = ({ trackRef }: { trackRef: RefObject<HTMLDivElement | null> }) => {
  return (
    <div ref={trackRef} className="hidden h-screen min-h-[520px] md:flex" style={{ width: `${TOTAL_PIPELINE_PANELS * 100}vw` }}>
      <div className="h-panel flex h-full w-screen shrink-0 flex-col justify-center border-r border-[#1E1E32] px-[clamp(24px,6vw,80px)]">
        <div className="max-w-[720px]">
          <div className="h-item section-label mb-5">Execution Pipeline</div>
          <h2 className="font-display h-item mb-8 text-[clamp(40px,7vw,100px)] font-black leading-[0.95] tracking-[-0.05em] text-white">
            Four steps.
            <br />
            Zero guesswork.
          </h2>
          <p className="h-item mb-6 max-w-[460px] text-[16px] leading-[1.75] text-[#B0B0C8]">
            From raw market conviction to autonomous trade execution, every step is verifiable, evidence-gated, and fully transparent.
          </p>
          <p className="h-item mb-12 max-w-[400px] text-[14px] leading-[1.8] text-[#8E8EA8]">
            Scroll right to walk through the full agent pipeline from thesis to trade. Each step is handled by a specialized AI agent.
          </p>

          <div className="h-item mb-8 flex flex-wrap gap-3">
            {PIPELINE_STEPS.map((step) => {
              const Icon = step.icon

              return (
                <div key={step.num} className="flex items-center gap-2 border border-[#1E1E32] bg-[#0A0A16] px-3 py-1.5">
                  <span style={{ color: step.accent }}>
                    <Icon size={22} />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.08em] text-[#5A5A7A]">{step.label}</span>
                </div>
              )
            })}
          </div>

          <div className="h-item flex items-center gap-3">
            <span className="font-mono text-[12px] text-[#2E2E4A]">scroll {'->'}</span>
            <div className="h-px w-[60px] bg-[#2E2E4A]" />
          </div>
        </div>
      </div>

      {PIPELINE_STEPS.map((step, index) => {
        const Icon = step.icon

        return (
          <div
            key={step.num}
            className={`h-panel relative flex h-full w-screen shrink-0 items-center px-[clamp(24px,6vw,80px)] ${
              index < PIPELINE_STEPS.length - 1 ? 'border-r border-[#1E1E32]' : ''
            } ${index % 2 === 0 ? 'bg-[rgba(7,7,15,0.74)]' : 'bg-[rgba(10,10,22,0.78)]'}`}
          >
            <div className="mx-auto grid w-full max-w-[1040px] items-center gap-10 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              <div>
                <div className="h-item mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border border-[#1E1E32]" style={{ background: `${step.accent}15`, color: step.accent }}>
                    <Icon size={22} />
                  </div>
                  <span
                    className="inline-block px-2.5 py-0.5 font-mono text-[11px] tracking-[0.12em]"
                    style={{ color: step.accent, border: `1px solid ${step.accent}33`, background: `${step.accent}0A` }}
                  >
                    {step.num} - {step.label}
                  </span>
                </div>

                <h3 className="font-display h-item mb-4 text-[clamp(24px,3vw,40px)] font-extrabold leading-[1.15] tracking-[-0.05em] text-white">
                  {step.title}
                </h3>
                <p className="h-item mb-6 text-[15px] leading-[1.75] text-[#B0B0C8]">{step.desc}</p>

                <div className="h-item mb-6">
                  <PipelineFeatureList accent={step.accent} features={step.features} />
                </div>

                <div className="h-item flex items-baseline gap-3 border-l-2 pl-4" style={{ borderColor: step.accent }}>
                  <span className="font-display text-[28px] font-bold text-white">{step.stat.value}</span>
                  <span className="font-mono text-[11px] text-[#5A5A7A]">{step.stat.label}</span>
                </div>
              </div>

              <div className="h-item relative overflow-hidden rounded-[24px] border border-[#1E1E32] bg-[linear-gradient(180deg,rgba(14,14,28,0.96),rgba(10,10,20,0.92))] shadow-[0_26px_80px_rgba(0,0,0,0.32)]">
                <div className="absolute inset-y-8 left-0 w-px" style={{ background: `${step.accent}55` }} />

                <div className="flex items-center justify-between border-b border-[#1E1E32] px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    {['#FF5F57', '#FEBC2E', '#28C840'].map((dot) => (
                      <div key={dot} className="h-2.5 w-2.5 rounded-full" style={{ background: dot }} />
                    ))}
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#5A5A7A]">{step.label.toLowerCase()}-agent</span>
                  </div>

                  <span
                    className="rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em]"
                    style={{ color: step.accent, borderColor: `${step.accent}44`, background: `${step.accent}12` }}
                  >
                    step {step.num}
                  </span>
                </div>

                <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_148px]">
                  <PipelineTerminal accent={step.accent} code={step.code} />
                  <PipelineInfoGrid step={step} />
                </div>

                <div className="flex items-center justify-between border-t border-[#1E1E32] px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full" style={{ background: step.accent }} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5A5A7A]">execution frame aligned</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#2E2E4A]">narrative / {step.num}</span>
                </div>
              </div>
            </div>

            {index < PIPELINE_STEPS.length - 1 && (
              <div className="absolute right-8 top-1/2 flex -translate-y-1/2 items-center gap-2">
                <div className="h-px w-8" style={{ background: step.accent }} />
                <ArrowRight size={14} style={{ color: step.accent }} />
              </div>
            )}

            <div
              className="pointer-events-none absolute bottom-10 right-10 font-mono text-[#0D0D1A]"
              style={{ fontSize: 'clamp(80px,12vw,160px)', fontWeight: 900, lineHeight: 1 }}
            >
              {step.num}
            </div>
          </div>
        )
      })}
    </div>
  )
}

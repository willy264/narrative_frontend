import type { PipelineStep } from './PipelineData'
import { PIPELINE_STEPS } from './PipelineData'
import { PipelineFeatureList, PipelineTerminal, PipelineInfoGrid } from './PipelineShared'

const PipelineMobileCard = ({ step }: { step: PipelineStep }) => {
  const Icon = step.icon

  return (
    <div className="grid gap-5 border border-[#1E1E32] bg-[linear-gradient(180deg,rgba(14,14,28,0.96),rgba(10,10,20,0.92))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div className="flex flex-wrap items-center gap-3">
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

      <div>
        <h3 className="font-display mb-3 text-[28px] font-extrabold leading-[1.06] tracking-[-0.05em] text-white">{step.title}</h3>
        <p className="mb-5 text-[15px] leading-[1.75] text-[#B0B0C8]">{step.desc}</p>
        <PipelineFeatureList accent={step.accent} features={step.features} />

        <div className="hidden items-baseline gap-3 border-l-2 pl-4 sm:flex" style={{ borderColor: step.accent }}>
          <span className="font-display text-[28px] font-bold text-white">{step.stat.value}</span>
          <span className="font-mono text-[11px] text-[#5A5A7A]">{step.stat.label}</span>
        </div>
      </div>

      <div className="hidden gap-4 lg:grid">
        <PipelineTerminal accent={step.accent} code={step.code} compact />
        <PipelineInfoGrid step={step} compact />
      </div>
    </div>
  )
}

export const PipelineMobile = () => {
  return (
    <div className="grid gap-6 px-[clamp(24px,6vw,80px)] py-[clamp(56px,8vw,88px)] md:hidden">
      <div className="max-w-[720px]">
        <div className="section-label mb-5">Execution Pipeline</div>
        <h2 className="font-display mb-6 text-[clamp(32px,10vw,48px)] font-black leading-[0.95] tracking-[-0.05em] text-white">
          Four steps.
          <br />
          Zero guesswork.
        </h2>
        <p className="mb-4 max-w-[460px] text-[15px] leading-[1.75] text-[#B0B0C8]">
          From raw market conviction to autonomous trade execution, every handoff is evidence-gated and visible.
        </p>
        <p className="max-w-[440px] text-[14px] leading-[1.8] text-[#8E8EA8]">
          On smaller screens the pipeline stacks vertically so each phase stays readable without sideways scroll.
        </p>
      </div>

      {PIPELINE_STEPS.map((step) => (
        <PipelineMobileCard key={step.num} step={step} />
      ))}
    </div>
  )
}

import type { PipelineStep } from './PipelineData'

const getPipelineCodeColor = (line: string, lineIndex: number, lastIndex: number, accent: string) => {
  if (line === '') return 'transparent'
  if (lineIndex === lastIndex) return accent
  if (line.includes('OK') || line.includes('COMPLETE')) return '#00E676'
  if (line.includes('APPROVE')) return '#FACC15'

  return '#4A4A6A'
}

export const PipelineFeatureList = ({ accent, features }: { accent: string; features: string[] }) => {
  return (
    <div className="mb-5 grid gap-2 sm:grid-cols-2">
      {features.map((feature) => (
        <div key={feature} className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full" style={{ background: accent }} />
          <span className="font-mono text-[11px] text-[#5A5A7A]">{feature}</span>
        </div>
      ))}
    </div>
  )
}

export const PipelineTerminal = ({
  accent,
  code,
  compact = false,
}: {
  accent: string
  code: string[]
  compact?: boolean
}) => {
  const lastIndex = code.length - 1

  return (
    <div className={compact ? 'border border-[#17172A] bg-[#0B0B17] p-4' : 'rounded-[18px] border border-[#17172A] bg-[#0B0B17] p-5'}>
      {code.map((line, lineIndex) => (
        <div
          key={`${line}-${lineIndex}`}
          className={[
            compact ? 'font-mono text-[12px] leading-[1.9]' : 'font-mono text-[12px] leading-[2]',
            lineIndex === lastIndex ? 'font-semibold' : '',
          ].join(' ')}
          style={{ color: getPipelineCodeColor(line, lineIndex, lastIndex, accent) }}
        >
          {line || '\u00A0'}
        </div>
      ))}
    </div>
  )
}

export const PipelineInfoGrid = ({ step, compact = false }: { step: PipelineStep; compact?: boolean }) => {
  return (
    <div className={`grid gap-px overflow-hidden border border-[#17172A] bg-[#1E1E32] ${compact ? 'sm:grid-cols-3' : 'rounded-[18px]'}`}>
      <div className="bg-[#0A0A16] px-4 py-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#2E2E4A]">signal</div>
        <div className="font-display mt-2 text-[22px] font-bold text-white">{step.stat.value}</div>
        <div className="mt-1 font-mono text-[10px] leading-[1.6] text-[#5A5A7A]">{step.stat.label}</div>
      </div>
      <div className="bg-[#0A0A16] px-4 py-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#2E2E4A]">priority</div>
        <div className="font-display mt-2 text-[18px] font-semibold text-white">{step.label}</div>
        <div className="mt-1 font-mono text-[10px] leading-[1.6] text-[#5A5A7A]">{step.features[0]}</div>
      </div>
      <div className="bg-[#0A0A16] px-4 py-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#2E2E4A]">focus</div>
        <div className="mt-2 font-mono text-[11px] leading-[1.7] text-[#B0B0C8]">{step.features[1]}</div>
      </div>
    </div>
  )
}

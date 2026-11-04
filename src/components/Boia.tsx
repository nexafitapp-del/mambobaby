import { cn } from '@/lib/utils'

const CORES = [
  'from-cyan-300 via-sky-400 to-blue-500',
  'from-pink-300 via-rose-400 to-fuchsia-500',
  'from-amber-300 via-orange-400 to-rose-500',
]

/** Ilustração vetorial da boia: sem depender de imagens externas. */
export function Boia({ className, variante = 0 }: { className?: string; variante?: number }) {
  return (
    <div className={cn('relative aspect-square w-full', className)} aria-hidden="true">
      <div className="absolute inset-x-[12%] bottom-0 h-[10%] rounded-[50%] bg-sky-900/20 blur-md" />
      <div className={cn('absolute inset-[6%] rounded-full bg-gradient-to-br shadow-[0_30px_60px_-25px_rgba(2,32,71,0.45)] ring-1 ring-white/60', CORES[variante % CORES.length])}>
        <div className="absolute inset-[16%] rounded-full bg-sky-50 shadow-inner ring-4 ring-white/70" />
        <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-white to-sky-100 shadow-inner" />
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full text-white/85" fill="none">
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.8" strokeDasharray="6 5" opacity="0.7" />
        </svg>
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute -top-1/4 -left-1/3 h-[150%] w-[45%] animate-shine bg-white/30 blur-md" />
        </div>
      </div>
      <svg viewBox="0 0 120 60" className="absolute inset-x-0 -bottom-4 mx-auto w-[80%] text-sky-400" fill="none" aria-hidden="true">
        <path d="M2 30c10 0 10-10 20-10s10 10 20 10 10-10 20-10 10 10 20 10 10-10 20-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <path d="M18 46c10 0 10-8 20-8s10 8 20 8 10-8 20-8 10 8 20 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
      </svg>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

/** Selo da marca: sol, onda e o nome MamboBaby. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" aria-label="MamboBaby, início" className="group flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700">
      <span className="relative grid size-10 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 transition-transform duration-500 group-hover:-rotate-6">
        <svg viewBox="0 0 32 32" className="size-6" fill="none" aria-hidden="true">
          <circle cx="16" cy="12" r="5" fill="#FDE68A" />
          <path d="M3 22c3.2 0 3.2-3 6.5-3S12.7 22 16 22s3.2-3 6.5-3S25.8 22 29 22" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M6 27c3.2 0 3.2-2.4 6.5-2.4S16.2 27 19.5 27" stroke="#bae6fd" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </span>
      <span className={cn('text-xl font-black tracking-tight text-sky-900 sm:text-2xl', compact && 'text-lg sm:text-xl')}>
        Mambo<span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">Baby</span>
      </span>
    </Link>
  )
}

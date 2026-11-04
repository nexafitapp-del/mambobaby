import { useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { urlImagem } from '@/lib/catalogo'

type Props = {
  imagens: string[]
  alt: string
  /** Mostrado quando o produto ainda não tem fotos cadastradas. */
  reserva?: ReactNode
  selo?: ReactNode
  className?: string
}

export function Galeria({ imagens, alt, reserva, selo, className }: Props) {
  const [ativa, setAtiva] = useState(0)
  const total = imagens.length
  const indice = total ? Math.min(ativa, total - 1) : 0

  return (
    <div className={cn('relative', className)}>
      {selo && <div className="absolute top-5 left-5 z-10">{selo}</div>}

      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-cyan-100 via-sky-50 to-orange-50 p-4 ring-1 ring-sky-100 sm:p-6">
        <div className="grid aspect-square w-full place-items-center overflow-hidden rounded-[1.5rem] bg-white/60">
          {total ? (
            <img
              key={imagens[indice]}
              src={urlImagem(imagens[indice])}
              alt={total > 1 ? `${alt} — foto ${indice + 1} de ${total}` : alt}
              className="size-full animate-rise object-contain"
              loading="eager"
            />
          ) : (
            reserva
          )}
        </div>
      </div>

      {total > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {imagens.map((img, i) => (
            <li key={img}>
              <button
                type="button"
                onClick={() => setAtiva(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === indice}
                className={cn(
                  'block w-full overflow-hidden rounded-xl bg-white ring-2 transition-all hover:-translate-y-0.5',
                  i === indice ? 'ring-sky-600' : 'ring-sky-100 hover:ring-sky-300',
                )}
              >
                <img src={urlImagem(img)} alt="" className="aspect-square w-full object-cover" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

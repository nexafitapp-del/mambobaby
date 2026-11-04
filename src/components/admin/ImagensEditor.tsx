import { useRef, useState } from 'react'
import { ImagePlus, Loader2, Star, Trash2 } from 'lucide-react'
import { enviarImagem, removerImagem } from '@/lib/admin'
import { urlImagem } from '@/lib/catalogo'
import { cn } from '@/lib/utils'

type Props = {
  token: string
  imagens: string[]
  onChange: (imagens: string[]) => void
  erro?: string
}

export function ImagensEditor({ token, imagens, onChange, erro }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const [enviando, setEnviando] = useState(0)
  const [falha, setFalha] = useState('')
  const [arrasta, setArrasta] = useState(false)

  async function receber(arquivos: FileList | null) {
    if (!arquivos?.length) return
    setFalha('')
    const lista = Array.from(arquivos).slice(0, 8)
    setEnviando(lista.length)
    const novas: string[] = []
    const erros: string[] = []
    for (const arquivo of lista) {
      try {
        novas.push(await enviarImagem(token, arquivo))
      } catch (e) {
        erros.push(e instanceof Error ? e.message : 'Falha no envio.')
      } finally {
        setEnviando((n) => Math.max(0, n - 1))
      }
    }
    if (novas.length) onChange([...imagens, ...novas])
    if (erros.length) setFalha(erros[0])
    if (input.current) input.current.value = ''
  }

  async function excluir(caminho: string) {
    onChange(imagens.filter((i) => i !== caminho))
    try {
      await removerImagem(token, caminho)
    } catch {
      /* o registro já saiu da lista; o arquivo pode ficar órfão */
    }
  }

  function mover(caminho: string) {
    onChange([caminho, ...imagens.filter((i) => i !== caminho)])
  }

  return (
    <div className="grid gap-2">
      <p className="text-xs font-bold text-sky-900/70">
        Fotos do produto <span className="font-medium text-sky-900/45">— a primeira é a imagem principal</span>
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setArrasta(true) }}
        onDragLeave={() => setArrasta(false)}
        onDrop={(e) => { e.preventDefault(); setArrasta(false); void receber(e.dataTransfer.files) }}
        className={cn(
          'rounded-2xl border-2 border-dashed p-4 text-center transition-colors',
          arrasta ? 'border-sky-500 bg-sky-50' : 'border-sky-200 bg-sky-50/40',
        )}
      >
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          hidden
          onChange={(e) => void receber(e.target.files)}
        />
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={enviando > 0}
          className="inline-flex items-center gap-2 rounded-full bg-sky-700 px-4 py-2 text-xs font-black text-white hover:bg-sky-800 disabled:opacity-60"
        >
          {enviando > 0 ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ImagePlus className="size-4" aria-hidden />}
          {enviando > 0 ? `Enviando ${enviando}…` : 'Escolher fotos'}
        </button>
        <p className="mt-2 text-[11px] text-sky-900/55">Arraste as imagens aqui ou toque no botão. JPG, PNG, WEBP ou AVIF, até 5 MB cada.</p>
      </div>

      {(falha || erro) && <p className="rounded-xl bg-red-50 p-2.5 text-[11px] font-bold text-red-700 ring-1 ring-red-200">{falha || erro}</p>}

      {imagens.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {imagens.map((caminho, i) => (
            <li key={caminho} className="group relative overflow-hidden rounded-xl bg-white ring-1 ring-sky-100">
              <img src={urlImagem(caminho)} alt={`Foto ${i + 1}`} className="aspect-square w-full object-cover" loading="lazy" />
              {i === 0 && (
                <span className="absolute top-1 left-1 rounded-full bg-sky-700 px-1.5 py-0.5 text-[9px] font-black text-white">PRINCIPAL</span>
              )}
              <div className="absolute inset-x-1 bottom-1 flex justify-between gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                {i > 0 ? (
                  <button type="button" onClick={() => mover(caminho)} aria-label="Usar como imagem principal" className="grid size-7 place-items-center rounded-full bg-white/95 text-sky-700 shadow hover:bg-white">
                    <Star className="size-3.5" aria-hidden />
                  </button>
                ) : <span />}
                <button type="button" onClick={() => void excluir(caminho)} aria-label="Remover foto" className="grid size-7 place-items-center rounded-full bg-white/95 text-red-600 shadow hover:bg-white">
                  <Trash2 className="size-3.5" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

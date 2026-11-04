import { useState } from 'react'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { atualizarOferta, criarOferta, excluirOferta, type Oferta, type Produto } from '@/lib/admin'
import { brl } from '@/lib/loja'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Props = {
  token: string
  produto: Produto
  ofertas: Oferta[]
  onMudou: () => Promise<void> | void
}

const num = (v: string) => {
  const n = Number(v.replace(/[^\d,.]/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

export function OfertasEditor({ token, produto, ofertas, onMudou }: Props) {
  const [nome, setNome] = useState('')
  const [qtd, setQtd] = useState('1')
  const [desconto, setDesconto] = useState('0')
  const [destaque, setDestaque] = useState(false)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function adicionar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    if (nome.trim().length < 2) { setErro('Dê um nome ao kit, por exemplo: Kit Duplo.'); return }
    if (num(qtd) < 1) { setErro('A quantidade deve ser pelo menos 1.'); return }
    setSalvando(true)
    try {
      await criarOferta(token, {
        produto_id: produto.id,
        nome: nome.trim(),
        qtd: Math.round(num(qtd)),
        desconto_pct: num(desconto),
        destaque,
        ativo: true,
        ordem: ofertas.length,
      })
      setNome(''); setQtd('1'); setDesconto('0'); setDestaque(false)
      await onMudou()
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível criar o kit.')
    } finally {
      setSalvando(false)
    }
  }

  async function remover(o: Oferta) {
    try {
      await excluirOferta(token, o.id)
      await onMudou()
    } catch {
      setErro('Não foi possível excluir este kit.')
    }
  }

  async function alternarDestaque(o: Oferta) {
    try {
      await atualizarOferta(token, o.id, { destaque: !o.destaque })
      await onMudou()
    } catch {
      setErro('Não foi possível atualizar o destaque.')
    }
  }

  const classe = 'h-10 rounded-xl border-sky-200 bg-white'

  return (
    <div className="grid gap-3 rounded-2xl border border-sky-100 bg-white p-4">
      <div>
        <p className="text-sm font-black text-sky-950">Kits e descontos</p>
        <p className="text-[11px] text-sky-900/55">Cada kit multiplica a quantidade e aplica um desconto sobre o preço unitário.</p>
      </div>

      {ofertas.length === 0 ? (
        <p className="rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-800 ring-1 ring-amber-200">
          Este produto ainda não tem kit. Sem kit, a loja usa o preço unitário.
        </p>
      ) : (
        <ul className="grid gap-2">
          {ofertas.map((o) => {
            const total = Math.round(Number(produto.preco) * o.qtd * (1 - Number(o.desconto_pct) / 100) * 100) / 100
            return (
              <li key={o.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-sky-50/70 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-sky-950">{o.nome}{o.destaque ? ' ★' : ''}</p>
                  <p className="text-[11px] text-sky-900/60">{o.qtd} un · {Number(o.desconto_pct)}% OFF · {brl(total)}</p>
                </div>
                <button type="button" onClick={() => void alternarDestaque(o)} className="rounded-full border border-sky-200 px-3 py-1 text-[11px] font-bold text-sky-800 hover:bg-white">
                  {o.destaque ? 'Remover destaque' : 'Destacar'}
                </button>
                <button type="button" onClick={() => void remover(o)} aria-label={`Excluir kit ${o.nome}`} className="grid size-8 place-items-center rounded-full border border-red-200 text-red-600 hover:bg-red-50">
                  <Trash2 className="size-3.5" aria-hidden />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <form onSubmit={adicionar} className="grid gap-2 border-t border-dashed border-sky-100 pt-3 sm:grid-cols-[1.4fr_0.6fr_0.7fr_auto]">
        <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do kit" aria-label="Nome do kit" className={classe} />
        <Input value={qtd} onChange={(e) => setQtd(e.target.value)} inputMode="numeric" placeholder="Qtd" aria-label="Quantidade" className={classe} />
        <Input value={desconto} onChange={(e) => setDesconto(e.target.value)} inputMode="decimal" placeholder="% OFF" aria-label="Desconto em porcentagem" className={classe} />
        <Button type="submit" disabled={salvando} className="h-10 rounded-xl bg-sky-700 font-black text-white hover:bg-sky-800">
          {salvando ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <><Plus className="size-4" aria-hidden /> Kit</>}
        </Button>
      </form>

      <label className="inline-flex items-center gap-2 text-xs font-bold text-sky-900/80">
        <input type="checkbox" checked={destaque} onChange={(e) => setDestaque(e.target.checked)} className="size-4 accent-sky-600" />
        Marcar novo kit como melhor economia
      </label>

      {erro && <p className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700 ring-1 ring-red-200">{erro}</p>}
    </div>
  )
}

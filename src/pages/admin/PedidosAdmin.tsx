import { useEffect, useState } from 'react'
import { Loader2, Receipt } from 'lucide-react'
import { type Pedido } from '@/lib/admin'
import { brl } from '@/lib/loja'

export function PedidosAdmin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    setPedidos([])
    setCarregando(false)
  }, [])

  if (carregando) {
    return <p className="inline-flex items-center gap-2 rounded-2xl bg-white p-5 text-sm text-sky-900/60"><Loader2 className="size-4 animate-spin" aria-hidden /> Carregando pedidos…</p>
  }

  return (
    <div className="grid gap-4">
      {erro && (
        <p className="rounded-2xl bg-sky-50 p-4 text-sm font-bold text-sky-800 ring-1 ring-sky-200">{erro}</p>
      )}
      {pedidos.length === 0 ? (
        <div className="rounded-3xl border border-sky-100 bg-white p-8 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-sky-100 text-sky-700"><Receipt className="size-6" aria-hidden /></span>
          <p className="mt-3 font-black text-sky-950">Nenhum pedido ainda</p>
          <p className="mt-1 text-sm text-sky-900/60">Quando a loja começar a vender, os pedidos aparecem aqui — e a lista é liberada quando o painel voltar a exigir senha.</p>
        </div>
      ) : (
        <ul className="grid gap-2">
          {pedidos.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-white p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-sky-950">#{p.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-[11px] text-sky-900/55">{new Date(p.criado_em).toLocaleString('pt-BR')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-sky-800">{brl(Number(p.total ?? 0))}</p>
                <p className="text-[11px] font-bold text-sky-900/55">{p.status ?? 'pendente'}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

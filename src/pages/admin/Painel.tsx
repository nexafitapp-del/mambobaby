import { useState } from 'react'
import { AlertTriangle, Package, Receipt, Settings, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProdutosAdmin } from '@/pages/admin/ProdutosAdmin'
import { PedidosAdmin } from '@/pages/admin/PedidosAdmin'
import { ConfigAdmin } from '@/pages/admin/ConfigAdmin'

export function Painel() {
  const [aba, setAba] = useState<'produtos' | 'pedidos' | 'ajustes'>('produtos')

  const abas = [
    { id: 'produtos' as const, label: 'Produtos e kits', icon: Package },
    { id: 'pedidos' as const, label: 'Pedidos', icon: Receipt },
    { id: 'ajustes' as const, label: 'Ajustes', icon: Settings },
  ]

  return (
    <div className="min-h-svh bg-sky-50">
      <header className="sticky top-0 z-30 border-b border-sky-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-black text-sky-950">MamboBaby · Painel</p>
            <p className="truncate text-[11px] text-sky-900/55">Acesso aberto, sem senha</p>
          </div>
          <a href="/" className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 px-3.5 py-2 text-xs font-bold text-sky-800 hover:bg-sky-50">
            <Store className="size-3.5" aria-hidden /> Ver loja
          </a>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 px-4 pb-2" aria-label="Seções do painel">
          {abas.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setAba(id)}
              aria-current={aba === id}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black transition-colors',
                aba === id ? 'bg-sky-100 text-sky-900' : 'text-sky-900/50 hover:text-sky-900',
              )}
            >
              <Icon className="size-3.5" aria-hidden /> {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto grid max-w-5xl gap-4 px-4 py-6">
        <p className="flex items-start gap-2 rounded-2xl bg-amber-50 p-3 text-[11px] font-bold text-amber-800 ring-1 ring-amber-200">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span>Painel temporariamente aberto: qualquer pessoa com o link consegue cadastrar produtos. Assim que terminar, me peça para fechar o acesso com senha novamente.</span>
        </p>

        {aba === 'produtos' && <ProdutosAdmin />}
        {aba === 'pedidos' && <PedidosAdmin />}
        {aba === 'ajustes' && <ConfigAdmin />}
      </main>
    </div>
  )
}

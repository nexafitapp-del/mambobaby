import { useState } from 'react'
import { LogOut, Package, Receipt, Settings, Store } from 'lucide-react'
import { sair, sessaoSalva } from '@/lib/admin'
import { cn } from '@/lib/utils'
import { ProdutosAdmin } from '@/pages/admin/ProdutosAdmin'
import { PedidosAdmin } from '@/pages/admin/PedidosAdmin'
import { ConfigAdmin } from '@/pages/admin/ConfigAdmin'

export function Painel({ email, onSair }: { email: string; onSair: () => void }) {
  const [aba, setAba] = useState<'produtos' | 'pedidos' | 'ajustes'>('produtos')
  const tokenAtual = () => sessaoSalva()?.token ?? ''

  function deslogar() {
    sair()
    onSair()
  }

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
            <p className="truncate text-[11px] text-sky-900/55">{email}</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 px-3.5 py-2 text-xs font-bold text-sky-800 hover:bg-sky-50">
              <Store className="size-3.5" aria-hidden /> Ver loja
            </a>
            <button type="button" onClick={deslogar} className="inline-flex items-center gap-1.5 rounded-full bg-sky-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-sky-800">
              <LogOut className="size-3.5" aria-hidden /> Sair
            </button>
          </div>
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

      <main className="mx-auto max-w-5xl px-4 py-6">
        {aba === 'produtos' && <ProdutosAdmin />}
        {aba === 'pedidos' && <PedidosAdmin />}
        {aba === 'ajustes' && <ConfigAdmin token={tokenAtual()} />}
      </main>
    </div>
  )
}

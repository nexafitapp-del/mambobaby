import { useCallback, useEffect, useState } from 'react'
import { Loader2, Package } from 'lucide-react'
import {
  atualizarProduto, criarProduto, excluirProduto, listarOfertas, listarProdutos,
  type Oferta, type Produto,
} from '@/lib/admin'
import { sessaoSalva } from '@/lib/admin'
import { brl } from '@/lib/loja'
import { ProdutoForm } from '@/pages/admin/ProdutoForm'
import { OfertasEditor } from '@/pages/admin/OfertasEditor'
import { Button } from '@/components/ui/button'

export function ProdutosAdmin() {
  const token = sessaoSalva()?.token ?? ''
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [novo, setNovo] = useState(false)
  const [aberto, setAberto] = useState<string | null>(null)

  const recarregar = useCallback(async () => {
    setErro('')
    try {
      const [ps, os] = await Promise.all([listarProdutos(token), listarOfertas(token)])
      setProdutos(ps)
      setOfertas(os)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível carregar os produtos.')
    } finally {
      setCarregando(false)
    }
  }, [token])

  useEffect(() => { void recarregar() }, [recarregar])

  async function alternarAtivo(p: Produto) {
    setProdutos((atual) => atual.map((x) => (x.id === p.id ? { ...x, ativo: !x.ativo } : x)))
    try {
      await atualizarProduto(token, p.id, { ativo: !p.ativo })
    } catch {
      setErro('Não foi possível alterar a visibilidade deste produto.')
      void recarregar()
    }
  }

  async function remover(p: Produto) {
    if (!window.confirm(`Excluir "${p.nome}" e todos os seus kits?`)) return
    try {
      await excluirProduto(token, p.id)
      setProdutos((atual) => atual.filter((x) => x.id !== p.id))
      setOfertas((atual) => atual.filter((o) => o.produto_id !== p.id))
    } catch {
      setErro('Não foi possível excluir. Remova antes os kits vinculados.')
    }
  }

  if (carregando) {
    return <p className="inline-flex items-center gap-2 rounded-2xl bg-white p-5 text-sm text-sky-900/60"><Loader2 className="size-4 animate-spin" aria-hidden /> Carregando catálogo…</p>
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-black text-sky-950">Produtos da vitrine</h2>
          <p className="text-xs text-sky-900/60">Cadastre preços reais, descrições e kits com desconto.</p>
        </div>
        <Button onClick={() => setNovo((v) => !v)} className="rounded-full bg-gradient-to-r from-orange-500 to-amber-400 font-black text-white">
          {novo ? 'Fechar formulário' : '+ Novo produto'}
        </Button>
      </div>

      {erro && <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700 ring-1 ring-red-200">{erro}</p>}

      {novo && (
        <ProdutoForm
          onCancelar={() => setNovo(false)}
          onSalvar={async (dados) => {
            const criado = await criarProduto(token, dados)
            setNovo(false)
            await recarregar()
            if (criado?.[0]) setAberto(criado[0].id)
          }}
        />
      )}

      {produtos.length === 0 && (
        <div className="rounded-3xl border border-sky-100 bg-white p-8 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-sky-100 text-sky-700"><Package className="size-6" aria-hidden /></span>
          <p className="mt-3 font-black text-sky-950">Nenhum produto cadastrado</p>
          <p className="mt-1 text-sm text-sky-900/60">Comece pelo primeiro produto para ele aparecer na loja.</p>
        </div>
      )}

      <ul className="grid gap-3">
        {produtos.map((p) => {
          const minhas = ofertas.filter((o) => o.produto_id === p.id)
          const expandido = aberto === p.id
          return (
            <li key={p.id} className="overflow-hidden rounded-3xl border border-sky-100 bg-white">
              <div className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black text-sky-950">{p.nome}</p>
                  <p className="text-xs font-bold text-sky-800">
                    {brl(Number(p.preco))}
                    {p.preco_original ? <span className="ml-2 font-medium text-sky-900/40 line-through">{brl(Number(p.preco_original))}</span> : null}
                  </p>
                  <p className="mt-0.5 text-[11px] text-sky-900/50">{minhas.length} kit(s) · {p.ativo ? 'visível na loja' : 'oculto'}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button type="button" onClick={() => void alternarAtivo(p)} className="rounded-full border border-sky-200 px-3 py-1.5 text-[11px] font-bold text-sky-800 hover:bg-sky-50">
                    {p.ativo ? 'Ocultar' : 'Publicar'}
                  </button>
                  <button type="button" onClick={() => setAberto(expandido ? null : p.id)} className="rounded-full bg-sky-100 px-3 py-1.5 text-[11px] font-black text-sky-900 hover:bg-sky-200">
                    {expandido ? 'Fechar' : 'Editar'}
                  </button>
                  <button type="button" onClick={() => void remover(p)} className="rounded-full border border-red-200 px-3 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-50">
                    Excluir
                  </button>
                </div>
              </div>
              {expandido && (
                <div className="grid gap-5 border-t border-sky-100 bg-sky-50/40 p-4">
                  <ProdutoForm
                    produto={p}
                    onCancelar={() => setAberto(null)}
                    onSalvar={async (dados) => {
                      await atualizarProduto(token, p.id, dados)
                      await recarregar()
                    }}
                  />
                  <OfertasEditor token={token} produto={p} ofertas={minhas} onMudou={recarregar} />
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

import { useState } from 'react'
import { Loader2, Save, X } from 'lucide-react'
import type { Produto } from '@/lib/admin'
import { ImagensEditor } from '@/components/admin/ImagensEditor'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type Props = {
  produto?: Produto
  onSalvar: (dados: { nome: string; descricao: string; preco: number; preco_original: number | null; ativo: boolean; imagens: string[] }) => Promise<void>
  onCancelar: () => void
}

const numero = (v: string) => {
  const n = Number(v.replace(/[^\d,.]/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

export function ProdutoForm({ produto, onSalvar, onCancelar }: Props) {
  const [nome, setNome] = useState(produto?.nome ?? '')
  const [descricao, setDescricao] = useState(produto?.descricao ?? '')
  const [preco, setPreco] = useState(produto ? String(produto.preco) : '')
  const [original, setOriginal] = useState(produto?.preco_original ? String(produto.preco_original) : '')
  const [ativo, setAtivo] = useState(produto?.ativo ?? true)
  const [imagens, setImagens] = useState<string[]>(produto?.imagens ?? [])
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    if (nome.trim().length < 3) { setErro('Informe o nome completo do produto.'); return }
    if (numero(preco) <= 0) { setErro('Informe o preço de venda.'); return }
    setSalvando(true)
    try {
      await onSalvar({
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco: numero(preco),
        preco_original: original.trim() ? numero(original) : null,
        ativo,
        imagens,
      })
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível salvar o produto.')
    } finally {
      setSalvando(false)
    }
  }

  const classe = 'h-11 rounded-xl border-sky-200 bg-white'

  return (
    <form onSubmit={enviar} className="grid gap-3 rounded-2xl border border-sky-100 bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-sky-950">{produto ? 'Editar produto' : 'Novo produto'}</h3>
          <p className="text-[11px] text-sky-900/55">Os dados aparecem na vitrine assim que você salvar.</p>
        </div>
        <button type="button" onClick={onCancelar} aria-label="Fechar formulário" className="grid size-8 shrink-0 place-items-center rounded-full border border-sky-200 text-sky-700 hover:bg-sky-50">
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="nome">Nome do produto</Label>
          <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Boia Mambobaby Classic com cauda" className={classe} />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="descricao">Descrição curta</Label>
          <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} placeholder="FPU 50+, 3 meses a 3 anos, com cauda de segurança…" className="rounded-xl border border-sky-200 bg-white p-3 text-sm text-sky-950 outline-none focus-visible:ring-2 focus-visible:ring-sky-500" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="preco">Preço de venda (R$)</Label>
          <Input id="preco" value={preco} onChange={(e) => setPreco(e.target.value)} inputMode="decimal" placeholder="99,90" className={classe} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="original">Preço &quot;de&quot; (opcional)</Label>
          <Input id="original" value={original} onChange={(e) => setOriginal(e.target.value)} inputMode="decimal" placeholder="129,90" className={classe} />
        </div>
      </div>

      <ImagensEditor imagens={imagens} onChange={setImagens} />

      <label className="inline-flex items-center gap-2 text-xs font-bold text-sky-900/80">
        <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} className="size-4 accent-sky-600" />
        Visível na loja
      </label>

      {erro && <p className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700 ring-1 ring-red-200">{erro}</p>}
      {imagens.length === 0 && (
        <p className="text-[11px] font-bold text-amber-700">Dica: produtos com foto vendem mais. A vitrine mostra uma ilustração enquanto não houver imagem.</p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={salvando} className="rounded-xl bg-sky-700 font-black text-white hover:bg-sky-800">
          {salvando ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />} Salvar produto
        </Button>
        <Button type="button" variant="outline" onClick={onCancelar} className="rounded-xl border-sky-200 font-bold text-sky-800">Cancelar</Button>
      </div>
    </form>
  )
}

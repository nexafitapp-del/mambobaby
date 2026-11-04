import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { buscarConfig, salvarConfig, type ConfigLoja } from '@/lib/admin'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function ConfigAdmin() {
  const [form, setForm] = useState<ConfigLoja | null>(null)
  const [cupons, setCupons] = useState('')
  const [status, setStatus] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    void (async () => {
      try {
        const c = await buscarConfig()
        if (!c) { setErro('Os ajustes ainda não foram criados no banco.'); return }
        setForm(c)
        setCupons(JSON.stringify(c.cupons ?? {}, null, 2))
      } catch {
        setErro('Não foi possível carregar as configurações.')
      }
    })()
  }, [])

  function campo<K extends keyof ConfigLoja>(chave: K, valor: ConfigLoja[K]) {
    setForm((f) => (f ? { ...f, [chave]: valor } : f))
    setStatus('')
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setErro(''); setStatus('')
    let json: Record<string, number>
    try {
      json = JSON.parse(cupons || '{}') as Record<string, number>
      if (typeof json !== 'object' || Array.isArray(json)) throw new Error('formato')
    } catch {
      setErro('A lista de cupons precisa ser um objeto JSON, por exemplo: {"MAMBO10": 10}')
      return
    }
    setSalvando(true)
    try {
      await salvarConfig({ ...form, cupons: json })
      setStatus('Configurações salvas.')
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível salvar.')
    } finally {
      setSalvando(false)
    }
  }

  if (!form) {
    return erro
      ? <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700 ring-1 ring-red-200">{erro}</p>
      : <p className="flex items-center gap-2 text-sm font-bold text-sky-900/60"><Loader2 className="size-4 animate-spin" aria-hidden /> Carregando ajustes…</p>
  }

  const classe = 'h-11 rounded-xl border-sky-200 bg-white'

  return (
    <form onSubmit={salvar} className="grid gap-4 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-black text-sky-950">Ajustes da loja</h2>
        <p className="text-xs text-sky-900/55">Nome, slogan, preço padrão e cupons de desconto.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5"><Label htmlFor="nome_loja">Nome da loja</Label><Input id="nome_loja" value={form.nome_loja ?? ''} onChange={(e) => campo('nome_loja', e.target.value)} className={classe} /></div>
        <div className="grid gap-1.5"><Label htmlFor="slogan">Slogan</Label><Input id="slogan" value={form.slogan ?? ''} onChange={(e) => campo('slogan', e.target.value)} className={classe} /></div>
        <div className="grid gap-1.5"><Label htmlFor="preco_unitario">Preço (R$)</Label><Input id="preco_unitario" inputMode="decimal" value={String(form.preco_unitario ?? 0)} onChange={(e) => campo('preco_unitario', Number(e.target.value.replace(',', '.')) || 0)} className={classe} /></div>
        <div className="grid gap-1.5"><Label htmlFor="preco_original">Preço &quot;de&quot; (R$)</Label><Input id="preco_original" inputMode="decimal" value={String(form.preco_original ?? 0)} onChange={(e) => campo('preco_original', Number(e.target.value.replace(',', '.')) || 0)} className={classe} /></div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="cupons">Cupons (% de desconto em JSON)</Label>
          <textarea id="cupons" value={cupons} onChange={(e) => setCupons(e.target.value)} rows={4} spellCheck={false} className="rounded-xl border border-sky-200 bg-white p-3 font-mono text-xs text-sky-950 outline-none focus-visible:ring-2 focus-visible:ring-sky-500" />
          <p className="text-[11px] text-sky-900/55">Exemplo: <code>{'{"MAMBO10": 10, "VERAO15": 15}'}</code></p>
        </div>
      </div>

      {erro && <p className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700 ring-1 ring-red-200">{erro}</p>}
      {status && <p className="rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">{status}</p>}

      <div>
        <Button type="submit" disabled={salvando} className="rounded-xl bg-sky-700 font-black text-white hover:bg-sky-800">
          {salvando ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />} Salvar ajustes
        </Button>
      </div>
    </form>
  )
}

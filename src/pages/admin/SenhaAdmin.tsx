import { useState } from 'react'
import { KeyRound, Loader2, Save } from 'lucide-react'
import { trocarSenha } from '@/lib/admin'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function SenhaAdmin({ token }: { token: string }) {
  const [atual, setAtual] = useState('')
  const [nova, setNova] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [status, setStatus] = useState('')
  const [erro, setErro] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setStatus('')
    if (nova.length < 8) {
      setErro('A nova senha precisa ter ao menos 8 caracteres.')
      return
    }
    if (nova !== confirmar) {
      setErro('A confirmação não confere com a nova senha.')
      return
    }
    setSalvando(true)
    try {
      await trocarSenha(token, atual, nova)
      setAtual('')
      setNova('')
      setConfirmar('')
      setStatus('Senha alterada. Use a nova senha no próximo acesso.')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Não foi possível alterar a senha.'
      setErro(/load failed|failed to fetch|networkerror/i.test(msg) ? 'Não consegui falar com o servidor. Tente novamente.' : msg)
    } finally {
      setSalvando(false)
    }
  }

  const classe = 'h-11 rounded-xl border-sky-200 bg-white'

  return (
    <form onSubmit={submit} className="grid max-w-md gap-4 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-black text-sky-950">
          <KeyRound className="size-4 text-sky-700" aria-hidden /> Senha de acesso
        </h2>
        <p className="text-xs text-sky-900/55">Troque sua senha sempre que precisar. Use 8 caracteres ou mais.</p>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="senha-atual">Senha atual</Label>
        <Input id="senha-atual" type="password" autoComplete="current-password" value={atual} onChange={(e) => setAtual(e.target.value)} className={classe} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="senha-nova">Nova senha</Label>
        <Input id="senha-nova" type="password" autoComplete="new-password" minLength={8} value={nova} onChange={(e) => setNova(e.target.value)} className={classe} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="senha-confirmar">Repita a nova senha</Label>
        <Input id="senha-confirmar" type="password" autoComplete="new-password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} className={classe} required />
      </div>

      {erro && <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700 ring-1 ring-red-200">{erro}</p>}
      {status && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">{status}</p>}

      <Button type="submit" disabled={salvando} className="h-11 rounded-xl bg-sky-900 font-black text-white hover:bg-sky-800">
        {salvando ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Salvando…</> : <><Save className="size-4" aria-hidden /> Alterar senha</>}
      </Button>
    </form>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Lock } from 'lucide-react'
import { entrar } from '@/lib/admin'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/Logo'

export function LoginAdmin({ onEntrar }: { onEntrar: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const sessao = await entrar(email, senha)
      onEntrar(sessao.email)
      navigate('/admin', { replace: true })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Não foi possível entrar.'
      setErro(
        /load failed|failed to fetch|networkerror/i.test(msg)
          ? 'Não consegui falar com o servidor. Verifique sua internet, desative bloqueadores de anúncios para este site e tente novamente.'
          : msg,
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="grid min-h-svh place-items-center bg-gradient-to-br from-sky-950 via-sky-900 to-blue-900 px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl shadow-sky-950/40">
        <div className="flex items-center justify-between">
          <Logo />
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-black tracking-wide text-sky-800 uppercase">
            <Lock className="size-3" aria-hidden /> Restrito
          </span>
        </div>
        <h1 className="mt-5 text-2xl font-black tracking-tight text-sky-950">Painel administrativo</h1>
        <p className="mt-1 text-sm text-sky-900/60">Entre para cadastrar produtos, kits e preços da vitrine.</p>

        <div className="mt-5 grid gap-1.5">
          <Label htmlFor="adm-email" className="text-xs font-bold text-sky-900/70">E-mail</Label>
          <Input id="adm-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" placeholder="seu@email.com" className="h-11 rounded-xl border-sky-200" required />
        </div>
        <div className="mt-3 grid gap-1.5">
          <Label htmlFor="adm-senha" className="text-xs font-bold text-sky-900/70">Senha</Label>
          <Input id="adm-senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" placeholder="sua senha" className="h-11 rounded-xl border-sky-200" required />
        </div>

        {erro && (
          <div role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700 ring-1 ring-red-200">
            <p>{erro}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 font-black text-red-800 underline underline-offset-2 hover:text-red-900"
            >
              Recarregar a página
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 font-black text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
        >
          {carregando ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Entrando…</> : 'Entrar no painel'}
        </button>
        <a href="/" className="mt-4 block text-center text-xs font-bold text-sky-700 hover:underline">Voltar para a loja</a>
      </form>
    </div>
  )
}

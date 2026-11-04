import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, ShieldAlert, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { cn } from '@/lib/utils'
import { loja } from '@/lib/loja'

const NAV = [
  { to: "/", label: "Início", end: true },
  { to: "/produto", label: "Boias e kits" },
  { to: "/politicas", label: "Ajuda e políticas" },
]

function BarraSuperior() {
  return (
    <div className="relative overflow-hidden bg-sky-950 text-[11px] font-bold tracking-wide text-sky-100 sm:text-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center">
        <span className="hidden size-1.5 animate-pulse rounded-full bg-emerald-400 sm:block" aria-hidden />
        <span>Frete grátis para todo o Brasil</span>
        <span className="text-sky-500" aria-hidden>•</span>
        <span>Até 12x sem juros</span>
        <span className="hidden text-sky-500 sm:inline" aria-hidden>•</span>
        <span className="hidden sm:inline">Cupom MAMBO10 na 1ª compra</span>
      </div>
    </div>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [aberto, setAberto] = useState(false)
  const [rolou, setRolou] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setAberto(false), [pathname])

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-sky-50/60 via-white to-cyan-50/40">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-sky-900 focus:px-4 focus:py-2 focus:text-white">
        Pular para o conteúdo
      </a>
      <BarraSuperior />
      <header className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        rolou ? 'border-b border-sky-100 bg-white/85 shadow-[0_10px_30px_-24px_rgba(2,32,71,0.6)] backdrop-blur-xl' : 'bg-white/60 backdrop-blur-sm',
      )}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => cn(
                  'relative rounded-full px-4 py-2 text-sm font-bold transition-colors',
                  isActive ? 'text-sky-800' : 'text-sky-900/60 hover:text-sky-800',
                )}
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span className={cn('absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-sky-600 transition-transform duration-300', isActive ? 'scale-x-100' : 'scale-x-0')} aria-hidden />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="group relative hidden overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-5 font-black text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.03] active:scale-95 sm:inline-flex">
              <Link to="/produto">
                <span className="relative z-10">Comprar agora</span>
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/40 blur-md animate-shine" aria-hidden />
              </Link>
            </Button>
            <button
              type="button"
              onClick={() => setAberto((v) => !v)}
              aria-expanded={aberto}
              aria-controls="menu-mobile"
              aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
              className="grid size-10 place-items-center rounded-full border border-sky-200 bg-white text-sky-800 transition-colors hover:bg-sky-50 md:hidden"
            >
              {aberto ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </div>
        <div id="menu-mobile" className={cn('overflow-hidden border-sky-100 bg-white/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 md:hidden', aberto ? 'max-h-72 border-t opacity-100' : 'max-h-0 opacity-0')}>
          <nav className="mx-auto grid max-w-6xl gap-1 px-4 py-3" aria-label="Navegação mobile">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => cn('rounded-2xl px-4 py-3 text-base font-bold transition-colors', isActive ? 'bg-sky-100 text-sky-900' : 'text-sky-900/70 hover:bg-sky-50')}>
                {item.label}
              </NavLink>
            ))}
            <Button asChild className="mt-1 h-11 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 font-black text-white">
              <Link to="/produto">Comprar agora</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main id="conteudo" className="flex-1">{children}</main>

      <footer className="relative mt-20 overflow-hidden bg-sky-950 text-sky-100">
        <div className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-cyan-500/10 blur-3xl" aria-hidden />
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <p className="text-xl font-black text-white">{loja.nome}</p>
            <p className="mt-1 bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-sm font-bold text-transparent">{loja.slogan}</p>
            <p className="mt-4 flex max-w-md items-start gap-2 rounded-2xl bg-sky-900/60 p-4 text-xs leading-relaxed text-sky-200 ring-1 ring-sky-800">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-300" aria-hidden />
              <span>Boias são acessórios recreativos e não substituem coletes salva-vidas nem a supervisão constante de adultos.</span>
            </p>
          </div>
          <div>
            <p className="text-xs font-black tracking-widest text-sky-400 uppercase">Navegar</p>
            <ul className="mt-3 space-y-2 text-sm">
              {NAV.map((i) => <li key={i.to}><Link to={i.to} className="transition-colors hover:text-white hover:underline">{i.label}</Link></li>)}
              <li><Link to="/politicas" className="transition-colors hover:text-white hover:underline">Privacidade (LGPD)</Link></li>
              <li><Link to="/politicas" className="transition-colors hover:text-white hover:underline">Entrega e devolução</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-black tracking-widest text-sky-400 uppercase">Atendimento</p>
            <ul className="mt-3 space-y-2 text-sm text-sky-200">
              <li>Seg a sex, 9h às 18h</li>
              <li>contato@mambobaby.com.br</li>
              <li>Pagamento seguro via Mercado Pago</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-sky-900">
          <p className="mx-auto max-w-6xl px-6 py-5 text-xs text-sky-400">
            © {new Date().getFullYear()} {loja.nome}. Todos os direitos reservados. Preços e ofertas sujeitos a alteração.{' '}
            <Link to="/admin" className="font-bold text-sky-300/70 transition-colors hover:text-sky-100">Painel</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}

import { useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { Droplets, ShieldAlert, Sun, Waves } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { brl, calcular, loja } from '@/lib/loja'

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-2xl font-black text-sky-700">
      <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-sky-500 text-white">
        <Sun className="size-5 text-yellow-200" aria-hidden />
      </span>
      Mambo<span className="text-orange-400">Baby</span>
    </Link>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white/90 px-5 py-3 backdrop-blur">
        <Logo />
        <Button asChild className="rounded-full bg-orange-400 font-bold hover:bg-orange-500">
          <Link to="/produto">Comprar</Link>
        </Button>
      </header>
      {children}
      <footer className="mt-16 bg-sky-800 px-6 py-10 text-sm text-sky-100">
        <p className="font-bold">{loja.nome} — {loja.slogan}</p>
        <p className="mt-3 max-w-2xl">
          <ShieldAlert className="mr-1 inline size-4" aria-hidden />
          Boias são acessórios recreativos e não substituem coletes salva-vidas nem a supervisão constante de adultos.
        </p>
        <nav className="mt-4 flex flex-wrap gap-4 underline">
          <Link to="/politicas">Privacidade, termos, entrega e devolução</Link>
        </nav>
      </footer>
    </div>
  )
}

function Inicio() {
  return (
    <Layout>
      <section className="bg-gradient-to-b from-cyan-200 via-sky-100 to-white px-6 py-20 text-center">
        <Waves className="mx-auto mb-4 size-12 text-sky-600" aria-hidden />
        <h1 className="mx-auto max-w-2xl text-4xl font-black text-sky-800 text-balance sm:text-5xl">
          O verão fica ainda mais divertido com MamboBaby!
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-sky-900/80">
          Diversão, cores e momentos especiais para toda a família.
        </p>
        <Button asChild size="lg" className="mt-8 rounded-full bg-orange-400 px-8 font-black hover:bg-orange-500">
          <Link to="/produto">CONHECER AS BOIAS</Link>
        </Button>
        <p className="mt-6 text-xs text-sky-900/70">Uso somente com supervisão de um adulto.</p>
      </section>
      <section className="mx-auto grid max-w-4xl gap-4 px-6 py-12 sm:grid-cols-3">
        {loja.ofertas.map((o) => {
          const c = calcular(o.qtd, o.desconto)
          return (
            <Link to="/produto" key={o.id} className="rounded-3xl border-2 border-sky-200 bg-white p-6 text-center shadow-sm">
              <Droplets className="mx-auto mb-2 text-cyan-500" aria-hidden />
              <h2 className="font-black text-sky-800">{o.nome}</h2>
              <p className="text-sm text-muted-foreground line-through">{brl(c.original)}</p>
              <p className="text-2xl font-black text-sky-700">{brl(c.total)}</p>
              {o.desconto > 0 && <p className="text-sm font-bold text-orange-500">{o.desconto}% OFF</p>}
            </Link>
          )
        })}
      </section>
    </Layout>
  )
}

function Produto() {
  const [sel, setSel] = useState('familia')
  const [cupom, setCupom] = useState('')
  const [aplicado, setAplicado] = useState(0)
  const [msg, setMsg] = useState('')
  const oferta = loja.ofertas.find((o) => o.id === sel)!
  const c = calcular(oferta.qtd, oferta.desconto, aplicado)

  function aplicar() {
    const pct = loja.cupons[cupom.trim().toUpperCase()]
    setAplicado(pct ?? 0)
    setMsg(pct ? `Cupom aplicado: ${pct}% OFF` : 'Cupom inválido')
  }

  return (
    <Layout>
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-black text-sky-800 text-balance">
          Prepare-se para momentos inesquecíveis com MamboBaby!
        </h1>
        <p className="mt-3 text-muted-foreground">
          Imagens, vídeos, materiais, dimensões e faixa etária serão exibidos após o cadastro das informações oficiais do fabricante.
        </p>
        <div className="mt-8 grid gap-3">
          {loja.ofertas.map((o) => {
            const x = calcular(o.qtd, o.desconto)
            return (
              <button key={o.id} onClick={() => setSel(o.id)}
                className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left ${sel === o.id ? 'border-sky-500 bg-sky-50' : 'border-sky-100 bg-white'}`}>
                <span>
                  <b className="text-sky-800">{o.nome}</b>
                  {o.destaque && <span className="ml-2 rounded-full bg-yellow-300 px-2 py-0.5 text-xs font-bold">MELHOR ECONOMIA</span>}
                  <br /><small>{o.qtd} boia(s) · {brl(x.porUnidade)} cada</small>
                </span>
                <b className="text-sky-700">{brl(x.total)}</b>
              </button>
            )
          })}
        </div>
        <div className="mt-4 flex gap-2">
          <input value={cupom} onChange={(e) => setCupom(e.target.value)} placeholder="Cupom" className="flex-1 rounded-full border px-4 py-2" />
          <Button variant="outline" className="rounded-full" onClick={aplicar}>Aplicar</Button>
        </div>
        {msg && <p className="mt-2 text-sm">{msg}</p>}
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-muted-foreground line-through">{brl(c.original)}</p>
          <p className="text-3xl font-black text-sky-700">{brl(c.total)}</p>
          <Button size="lg" disabled className="mt-4 w-full rounded-full bg-orange-400 font-black">QUERO MINHA MAMBOBABY</Button>
          <p className="mt-2 text-xs text-muted-foreground">Checkout com Mercado Pago em breve: requer backend e credenciais seguras.</p>
        </div>
      </main>
    </Layout>
  )
}

function Politicas() {
  return (
    <Layout>
      <main className="mx-auto max-w-2xl px-6 py-10 text-sm leading-relaxed">
        <h1 className="mb-4 text-3xl font-black text-sky-800">Políticas</h1>
        <p>Privacidade (LGPD), termos de uso, entrega e devolução serão publicados aqui com o texto jurídico definido pelo proprietário.</p>
        <p className="mt-4 font-bold">Aviso: boias são acessórios recreativos e não substituem coletes salva-vidas nem supervisão constante de adultos.</p>
      </main>
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/produto" element={<Produto />} />
        <Route path="/politicas" element={<Politicas />} />
      </Routes>
    </BrowserRouter>
  )
}

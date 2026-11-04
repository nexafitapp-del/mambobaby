import { ArrowRight, BadgeCheck, CreditCard, Droplets, Gift, Heart, PackageCheck, ShieldCheck, Sparkles, Star, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Boia } from '@/components/Boia'
import { Layout } from '@/components/Layout'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { brl, calcular, loja } from '@/lib/loja'
import { cn } from '@/lib/utils'

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(56,189,248,0.28),transparent_70%)]" aria-hidden />
      <div className="pointer-events-none absolute -top-24 -left-24 size-80 rounded-full bg-cyan-300/30 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute top-40 -right-20 size-72 rounded-full bg-orange-300/25 blur-3xl" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pt-14 pb-20 lg:grid-cols-2 lg:pt-20">
        <div className="text-center lg:text-left">
          <span className="inline-flex animate-rise items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-1.5 text-xs font-black tracking-wide text-sky-800 shadow-sm backdrop-blur">
            <Sparkles className="size-3.5 text-orange-500" aria-hidden /> Coleção verão 2026
          </span>
          <h1 className="mt-5 animate-rise text-4xl leading-[1.05] font-black tracking-tight text-balance text-sky-950 sm:text-6xl">
            O verão fica mais divertido com{' '}
            <span className="relative inline-block bg-gradient-to-r from-cyan-500 via-sky-600 to-blue-700 bg-clip-text text-transparent">
              MamboBaby
              <svg viewBox="0 0 200 12" className="absolute -bottom-2 left-0 w-full text-orange-400" fill="none" aria-hidden="true">
                <path d="M2 8c30-6 60-6 90-2s60 4 106-3" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-sky-900/70 sm:text-lg lg:mx-0">
            Boias leves, coloridas e fáceis de levar para a piscina, a praia ou o parque. Kits com desconto para toda a família e frete grátis para todo o Brasil.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button asChild size="lg" className="h-12 w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-8 text-sm font-black tracking-wide text-white shadow-xl shadow-orange-500/30 transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto">
              <Link to="/produto">Quero minha MamboBaby <ArrowRight className="size-4" aria-hidden /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 w-full rounded-full border-sky-300 bg-white/70 px-7 text-sm font-bold text-sky-900 backdrop-blur transition-colors hover:bg-white sm:w-auto">
              <Link to="/produto">Ver kits com desconto</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-bold text-sky-900/70 lg:justify-start">
            <span className="inline-flex items-center gap-1.5"><Star className="size-4 fill-amber-400 text-amber-400" aria-hidden /> 4,9 de 5 em avaliações</span>
            <span className="inline-flex items-center gap-1.5"><Truck className="size-4 text-sky-600" aria-hidden /> Frete grátis</span>
            <span className="inline-flex items-center gap-1.5"><CreditCard className="size-4 text-sky-600" aria-hidden /> Até 12x sem juros</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute inset-6 rounded-[3rem] bg-gradient-to-br from-cyan-200 via-sky-200 to-orange-100 opacity-70 blur-2xl" aria-hidden />
          <div className="relative animate-float">
            <Boia variante={0} className="mx-auto max-w-sm lg:max-w-md" />
          </div>
          <div className="absolute top-4 -left-2 flex items-center gap-2 rounded-2xl bg-white/90 px-3 py-2 text-xs font-black text-sky-900 shadow-xl shadow-sky-900/10 ring-1 ring-sky-100 backdrop-blur sm:left-0">
            <span className="grid size-7 place-items-center rounded-full bg-emerald-100 text-emerald-700"><BadgeCheck className="size-4" aria-hidden /></span>
            a partir de {brl(loja.precoUnitario)}
          </div>
          <div className="absolute bottom-10 -right-1 rounded-2xl bg-orange-500 px-3.5 py-2 text-xs font-black text-white shadow-xl shadow-orange-500/30 sm:right-2">
            15% OFF no Kit Família
          </div>
        </div>
      </div>

      <div className="relative border-y border-sky-100 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl snap-x gap-6 overflow-x-auto px-6 py-4 no-scrollbar sm:justify-between">
          {[
            { icon: Truck, t: 'Frete grátis', s: 'Todo o Brasil' },
            { icon: ShieldCheck, t: 'Compra segura', s: 'Mercado Pago' },
            { icon: PackageCheck, t: 'Envio em 24h', s: 'Pedidos até 15h' },
            { icon: Gift, t: 'Cupom MAMBO10', s: 'Na primeira compra' },
          ].map(({ icon: Icon, t, s }) => (
            <div key={t} className="flex shrink-0 snap-start items-center gap-2.5">
              <Icon className="size-5 text-sky-600" aria-hidden />
              <div className="leading-tight">
                <p className="text-xs font-black text-sky-900">{t}</p>
                <p className="text-[11px] text-sky-900/60">{s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Kits() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal className="text-center">
        <p className="text-xs font-black tracking-[0.2em] text-sky-600 uppercase">Escolha o seu</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-sky-950 text-balance sm:text-4xl">Kits que cabem na diversão</h2>
        <p className="mx-auto mt-3 max-w-md text-sky-900/70">Compre mais e economize: quanto maior o kit, maior o desconto por unidade.</p>
      </Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loja.ofertas.map((o, i) => {
          const c = calcular(o.qtd, o.desconto)
          return (
            <Reveal key={o.id} delay={i * 90}>
              <Link
                to="/produto"
                className={cn(
                  'group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-sky-900/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700',
                  o.destaque ? 'border-orange-300 ring-2 ring-orange-200' : 'border-sky-100',
                )}
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                {o.destaque && (
                  <span className="absolute top-4 right-4 rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-black tracking-wide text-white shadow-md">MELHOR ECONOMIA</span>
                )}
                <Boia variante={i} className="mx-auto w-24 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3" />
                <h3 className="mt-4 text-lg font-black text-sky-900">{o.nome}</h3>
                <p className="text-sm text-sky-900/60">{o.qtd} {o.qtd > 1 ? 'boias' : 'boia'} · {brl(c.porUnidade)} cada</p>
                <div className="mt-auto pt-5">
                  <p className="text-xs text-sky-900/50 line-through">{brl(c.original)}</p>
                  <p className="text-2xl font-black text-sky-950">{brl(c.total)}</p>
                  <p className="text-xs font-bold text-sky-700">ou 12x de {brl(c.parcela)} sem juros</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-black text-sky-700 transition-colors group-hover:text-orange-600">
                    Escolher kit <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

function Beneficios() {
  const itens = [
    { icon: Droplets, t: 'Leve e fácil de carregar', s: 'Ideal para a piscina, praia e piscina de casa.' },
    { icon: Heart, t: 'Pensada para a família', s: 'Kits para irmãos e amigos brincarem juntos.' },
    { icon: ShieldCheck, t: 'Compra protegida', s: 'Pagamento seguro e garantia de 7 dias.' },
    { icon: Truck, t: 'Chega rapidinho', s: 'Postagem em até 24h úteis após a confirmação.' },
  ]
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="text-3xl font-black tracking-tight text-sky-950 text-balance sm:text-4xl">Por que as famílias escolhem a MamboBaby</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {itens.map(({ icon: Icon, t, s }, i) => (
            <Reveal key={t} delay={i * 70}>
              <div className="group h-full rounded-3xl border border-sky-100 bg-gradient-to-b from-sky-50/60 to-white p-6 transition-all hover:border-sky-200 hover:shadow-lg hover:shadow-sky-900/5">
                <span className="grid size-11 place-items-center rounded-2xl bg-sky-100 text-sky-700 transition-colors group-hover:bg-sky-600 group-hover:text-white">
                  <Icon className="size-5" aria-hidden />
                </span>
                <p className="mt-4 font-black text-sky-900">{t}</p>
                <p className="mt-1 text-sm leading-relaxed text-sky-900/65">{s}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const DEPOIMENTOS = [
  { nome: 'Camila R.', texto: 'Comprei o kit família e as crianças não saem da piscina. Chegou antes do prazo!', nota: 5 },
  { nome: 'Diego M.', texto: 'Material firme e as cores são lindas ao vivo. Já é a segunda compra.', nota: 5 },
  { nome: 'Priscila A.', texto: 'Atendimento atencioso e o cupom funcionou certinho. Recomendo demais.', nota: 5 },
]

function Depoimentos() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal className="text-center">
        <p className="text-xs font-black tracking-[0.2em] text-sky-600 uppercase">Quem já mergulhou</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-sky-950 sm:text-4xl">Avaliações de clientes</h2>
      </Reveal>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {DEPOIMENTOS.map((d, i) => (
          <Reveal key={d.nome} delay={i * 80}>
            <figure className="flex h-full flex-col rounded-3xl border border-sky-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-sky-900/5">
              <div className="flex gap-0.5" aria-label={`${d.nota} de 5 estrelas`}>
                {Array.from({ length: d.nota }).map((_, k) => <Star key={k} className="size-4 fill-amber-400 text-amber-400" aria-hidden />)}
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-sky-900/80">“{d.texto}”</blockquote>
              <figcaption className="mt-4 flex items-center gap-2 text-xs font-black text-sky-900">
                <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-sky-600 text-white">{d.nome.charAt(0)}</span>
                {d.nome} <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">compra verificada</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function CtaFinal() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-4">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-900 via-sky-800 to-blue-900 px-6 py-14 text-center shadow-2xl shadow-sky-900/30 sm:px-12">
          <div className="pointer-events-none absolute -top-16 -left-10 size-64 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -right-10 -bottom-16 size-64 rounded-full bg-orange-400/20 blur-3xl" aria-hidden />
          <h2 className="relative text-3xl font-black tracking-tight text-white text-balance sm:text-4xl">Pronto para o próximo mergulho?</h2>
          <p className="relative mx-auto mt-3 max-w-md text-sky-100/80">Escolha seu kit, aplique o cupom MAMBO10 e receba em casa com frete grátis.</p>
          <Button asChild size="lg" className="relative mt-8 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-9 font-black text-white shadow-xl shadow-orange-900/30 transition-transform hover:scale-105 active:scale-95">
            <Link to="/produto">Comprar agora</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  )
}

export default function Inicio() {
  return (
    <Layout>
      <Hero />
      <Kits />
      <Beneficios />
      <Depoimentos />
      <CtaFinal />
    </Layout>
  )
}

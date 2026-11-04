import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BadgeCheck, Check, CreditCard, Gift, Lock, PackageCheck, ShieldCheck, Star, Tag, Truck, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { Boia } from '@/components/Boia'
import { Checkout, dadosVazios, validarDados, type DadosCliente } from '@/components/Checkout'
import { Galeria } from '@/components/Galeria'
import { Layout } from '@/components/Layout'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { brl, loja as lojaLocal } from '@/lib/loja'
import { calcularKit, type KitVitrine } from '@/lib/catalogo'
import { useVitrine } from '@/lib/useVitrine'
import { cn } from '@/lib/utils'

export default function Produto() {
  const { slug } = useParams<{ slug?: string }>()
  const { produtos } = useVitrine()
  const produto = produtos.find((p) => p.id === slug) ?? produtos[0]
  const kits: KitVitrine[] = produto.kits.length ? produto.kits : lojaLocal.ofertas.map((o) => ({ ...o }))

  const [kitId, setKitId] = useState('')
  const kit = kits.find((k) => k.id === kitId) ?? kits.find((k) => k.destaque) ?? kits[0]
  const [cupom, setCupom] = useState('')
  const [aplicado, setAplicado] = useState(0)
  const [dados, setDados] = useState<DadosCliente>(dadosVazios)
  const [revisar, setRevisar] = useState(false)

  useEffect(() => {
    setAplicado(0)
    setCupom('')
  }, [produto.id])

  const c = calcularKit(produto.preco, produto.preco_original, kit.qtd, kit.desconto, aplicado)
  const indice = kits.findIndex((k) => k.id === kit.id)
  const precoBase = produto.preco_original && produto.preco_original > produto.preco ? produto.preco_original : produto.preco
  const descontoPrincipal = Math.max(0, Math.round((1 - produto.preco / precoBase) * 100))

  function aplicar() {
    const codigo = cupom.trim().toUpperCase()
    if (!codigo) {
      toast.error('Digite um cupom para aplicar.')
      return
    }
    const pct = lojaLocal.cupons[codigo]
    if (pct) {
      setAplicado(pct)
      toast.success(`Cupom ${codigo} aplicado: ${pct}% OFF`)
    } else {
      setAplicado(0)
      toast.error('Cupom inválido ou expirado.')
    }
  }

  function finalizar() {
    const erro = validarDados(dados)
    if (erro) {
      setRevisar(true)
      toast.error('Faltam dados para a entrega.', { description: erro })
      return
    }
    setRevisar(false)
    toast.info('Pagamento sendo liberado.', {
      description: `Dados de entrega de ${dados.nome} registrados. O checkout com Mercado Pago entra no ar assim que as credenciais forem conectadas.`,
    })
  }

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-5 pt-6 text-xs font-bold text-sky-900/50">
        <span>Início</span> <span aria-hidden>/</span> <span className="text-sky-800">{produto.nome.split(' ').slice(0, 3).join(' ')}</span>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-12">
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <Galeria
            imagens={produto.imagens}
            alt={produto.nome}
            reserva={<Boia key={kit.id} variante={indice} className="mx-auto max-w-xs animate-float sm:max-w-sm" />}
            selo={
              <span className="rounded-full bg-orange-500 px-3 py-1 text-[11px] font-black tracking-wide text-white shadow-lg shadow-orange-500/30">
                {descontoPrincipal > 0 ? `${descontoPrincipal}% OFF` : 'LANÇAMENTO'}
              </span>
            }
          />

          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-bold text-sky-900/70 sm:grid-cols-4">
            {[{ i: Truck, t: 'Frete grátis' }, { i: ShieldCheck, t: 'Compra segura' }, { i: PackageCheck, t: 'Envio em 24h' }, { i: Gift, t: 'Embalagem presente' }].map(({ i: Icon, t }) => (
              <span key={t} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-2 py-2 ring-1 ring-sky-100">
                <Icon className="size-3.5 text-sky-600" aria-hidden /> {t}
              </span>
            ))}
          </div>
        </Reveal>

        <div>
          <Reveal>
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900/60">
              <span className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="size-3.5 fill-amber-400 text-amber-400" />)}
              </span>
              <span>4,9</span> · <span>327 avaliações</span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 ring-1 ring-emerald-100">
                <BadgeCheck className="size-3" aria-hidden /> Em estoque
              </span>
            </div>
            <h1 className="mt-3 text-3xl leading-tight font-black tracking-tight text-sky-950 text-balance sm:text-4xl">
              {produto.nome}
            </h1>
            <p className="mt-3 leading-relaxed text-sky-900/70">
              {produto.descricao || 'Diversão, cores e momentos especiais para toda a família. Escolha a quantidade ideal e economize no kit.'}
            </p>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-sm text-sky-900/45 line-through">{brl(precoBase)}</span>
              <span className="text-3xl font-black text-sky-950">{brl(produto.preco)}</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700 ring-1 ring-emerald-100">
                à vista no Pix ou 12x sem juros
              </span>
            </div>
          </Reveal>

          <Reveal delay={80} className="mt-7">
            <p className="text-xs font-black tracking-widest text-sky-600 uppercase">Escolha seu kit</p>
            <div className="mt-3 grid gap-2.5" role="radiogroup" aria-label="Escolha do kit">
              {kits.map((o) => {
                const x = calcularKit(produto.preco, produto.preco_original, o.qtd, o.desconto)
                const ativo = kit.id === o.id
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={ativo}
                    onClick={() => setKitId(o.id)}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-all',
                      ativo ? 'border-sky-600 bg-sky-50/80 shadow-md shadow-sky-600/10' : 'border-sky-100 bg-white hover:border-sky-300 hover:bg-sky-50/40',
                    )}
                  >
                    <span className={cn('grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors', ativo ? 'border-sky-600 bg-sky-600 text-white' : 'border-sky-200 text-transparent')}>
                      <Check className="size-3" strokeWidth={4} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <b className="text-sm font-black text-sky-950">{o.nome}</b>
                        {o.destaque && <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-black text-amber-950">MELHOR ECONOMIA</span>}
                        {o.desconto > 0 && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-black text-orange-700">{o.desconto}% OFF</span>}
                      </span>
                      <span className="mt-0.5 block text-xs text-sky-900/60">{o.qtd} {o.qtd > 1 ? 'boias' : 'boia'} · {brl(x.porUnidade)} cada</span>
                    </span>
                    <span className="text-right">
                      <span className="block text-xs text-sky-900/40 line-through">{brl(x.original)}</span>
                      <b className="block text-base font-black text-sky-800">{brl(x.total)}</b>
                    </span>
                  </button>
                )
              })}
            </div>
          </Reveal>

          <Reveal delay={140} className="mt-5">
            <label htmlFor="cupom" className="text-xs font-black tracking-widest text-sky-600 uppercase">Cupom de desconto</label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Tag className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-sky-400" aria-hidden />
                <Input
                  id="cupom"
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value.toUpperCase())}
                  onKeyDown={(e) => { if (e.key === 'Enter') aplicar() }}
                  placeholder="Ex.: MAMBO10"
                  autoComplete="off"
                  className="h-11 rounded-full border-sky-200 bg-white pl-10 font-bold tracking-wide uppercase placeholder:font-medium placeholder:normal-case"
                />
              </div>
              <Button type="button" variant="outline" onClick={aplicar} className="h-11 rounded-full border-sky-300 px-6 font-black text-sky-800 hover:bg-sky-50">
                Aplicar
              </Button>
            </div>
            {aplicado > 0 ? (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <Check className="size-3.5" aria-hidden /> Cupom ativo: {aplicado}% OFF aplicado ao total
                <button type="button" className="ml-1 underline" onClick={() => { setAplicado(0); setCupom('') }}>remover</button>
              </p>
            ) : (
              <p className="mt-2 text-xs text-sky-900/55">Use MAMBO10 na primeira compra e ganhe 10% OFF.</p>
            )}
          </Reveal>

          <Reveal delay={200} className="mt-6">
            <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-xl shadow-sky-900/5 sm:p-6">
              <div className="mb-5 flex items-center gap-2 border-b border-dashed border-sky-100 pb-4">
                <span className="grid size-8 place-items-center rounded-full bg-orange-100 text-orange-600">
                  <UserRound className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-black text-sky-950">Dados para entrega</p>
                  <p className="text-[11px] text-sky-900/55">Preencha antes de concluir a compra</p>
                </div>
              </div>
              <Checkout dados={dados} onChange={setDados} />
            </div>
          </Reveal>

          <Reveal delay={200} className="mt-6">
            <div className={cn('rounded-3xl border bg-white p-5 shadow-xl shadow-sky-900/5 sm:p-6', revisar ? 'border-orange-300 ring-2 ring-orange-200' : 'border-sky-100')}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-sky-900/50">Total com {kit.nome}{aplicado > 0 ? ` + cupom ${aplicado}%` : ''}</p>
                  <p className="mt-0.5 text-3xl font-black tracking-tight text-sky-950 sm:text-4xl">{brl(c.total)}</p>
                  <p className="text-xs font-bold text-sky-700">ou 12x de {brl(c.parcela)} sem juros</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-sky-900/45 line-through">{brl(c.original)}</p>
                  {c.economia > 0 && (
                    <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700 ring-1 ring-emerald-100">
                      economize {brl(c.economia)}
                    </span>
                  )}
                </div>
              </div>

              <Button
                size="lg"
                className="mt-5 h-13 w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-sm font-black tracking-wide text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.01] active:scale-[0.99]"
                onClick={finalizar}
              >
                QUERO MINHA MAMBOBABY
              </Button>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-bold text-sky-900/55">
                <Lock className="size-3" aria-hidden /> Você só paga depois de confirmar a entrega
              </p>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-sky-900/55">
                <CreditCard className="size-3.5" aria-hidden /> Pix, cartão e boleto via Mercado Pago
              </p>
              <ul className="mt-4 grid gap-2 border-t border-dashed border-sky-100 pt-4 text-xs font-bold text-sky-900/70">
                {['Frete grátis para todo o Brasil', '7 dias para troca ou devolução', 'Suporte por e-mail em dias úteis'].map((t) => (
                  <li key={t} className="flex items-center gap-2"><Check className="size-3.5 text-emerald-600" aria-hidden /> {t}</li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={240} className="mt-4">
            <p className="rounded-2xl bg-amber-50 p-4 text-[11px] leading-relaxed text-amber-900 ring-1 ring-amber-200">
              <ShieldCheck className="mr-1 inline size-3.5" aria-hidden />
              Boias são acessórios recreativos e não substituem coletes salva-vidas nem a supervisão constante de adultos.
            </p>
          </Reveal>
        </div>
      </div>
    </Layout>
  )
}

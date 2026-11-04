import { useState } from 'react'
import { ChevronDown, FileText, Lock, RotateCcw, Truck } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { Reveal } from '@/components/Reveal'
import { cn } from '@/lib/utils'

const SECOES = [
  {
    id: 'privacidade',
    icon: Lock,
    titulo: 'Privacidade e LGPD',
    texto: 'Coletamos apenas os dados necessários para processar seu pedido e falar com você: nome, e-mail, telefone e endereço de entrega. Seus dados não são vendidos e ficam armazenados com acesso restrito. Você pode pedir acesso, correção ou exclusão pelo e-mail de atendimento. Ao navegar no site, você concorda com este uso mínimo e transparente.',
  },
  {
    id: 'termos',
    icon: FileText,
    titulo: 'Termos de uso',
    texto: 'As informações de produto, preços e disponibilidade podem ser atualizadas a qualquer momento. Pedidos só são confirmados após a aprovação do pagamento. Promoções e cupons são válidos enquanto durarem os estoques e não se acumulam, salvo indicação contrária.',
  },
  {
    id: 'entrega',
    icon: Truck,
    titulo: 'Entrega',
    texto: 'Enviamos para todo o Brasil com frete grátis. Pedidos confirmados até 15h de dias úteis são postados em até 24h úteis. O prazo de transporte varia conforme a região e o código de rastreamento é enviado por e-mail assim que o pedido sai do centro de distribuição.',
  },
  {
    id: 'devolucao',
    icon: RotateCcw,
    titulo: 'Troca e devolução',
    texto: 'Você tem até 7 dias corridos após o recebimento para solicitar troca ou devolução sem custo, conforme o Código de Defesa do Consumidor. O produto deve estar sem sinais de uso, com a embalagem original. Reembolsos ocorrem pelo mesmo meio de pagamento em até 10 dias úteis após a conferência.',
  },
]

function Acordeao() {
  const [aberto, setAberto] = useState<string>('privacidade')
  return (
    <div className="mt-8 grid gap-3">
      {SECOES.map(({ id, icon: Icon, titulo, texto }) => {
        const ativo = aberto === id
        return (
          <div key={id} className={cn('overflow-hidden rounded-3xl border bg-white transition-colors', ativo ? 'border-sky-300 shadow-lg shadow-sky-900/5' : 'border-sky-100')}>
            <h2>
              <button
                type="button"
                onClick={() => setAberto(ativo ? '' : id)}
                aria-expanded={ativo}
                aria-controls={`painel-${id}`}
                className="flex w-full items-center gap-3 px-5 py-4 text-left font-black text-sky-950 transition-colors hover:bg-sky-50/70"
              >
                <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl transition-colors', ativo ? 'bg-sky-600 text-white' : 'bg-sky-100 text-sky-700')}>
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="flex-1 text-base">{titulo}</span>
                <ChevronDown className={cn('size-5 text-sky-500 transition-transform duration-300', ativo && 'rotate-180')} aria-hidden />
              </button>
            </h2>
            <div id={`painel-${id}`} className={cn('grid transition-all duration-300 ease-out', ativo ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
              <div className="overflow-hidden">
                <p className="px-5 pb-5 pl-[4.25rem] text-sm leading-relaxed text-sky-900/75">{texto}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Politicas() {
  return (
    <Layout>
      <section className="border-b border-sky-100 bg-gradient-to-b from-cyan-200/60 via-sky-100/50 to-transparent px-6 py-14 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-1.5 text-xs font-black text-sky-800 backdrop-blur">
          <FileText className="size-3.5" aria-hidden /> Central de ajuda
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-sky-950 text-balance sm:text-4xl">Políticas e informações</h1>
        <p className="mx-auto mt-3 max-w-lg text-sky-900/70">Tudo o que você precisa saber sobre privacidade, entrega, trocas e as regras da loja.</p>
      </section>

      <main className="mx-auto max-w-3xl px-5 pb-16">
        <Reveal><Acordeao /></Reveal>
        <Reveal delay={100}>
          <div className="mt-6 rounded-3xl bg-amber-50 p-5 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-200">
            <p className="font-black">Aviso de segurança</p>
            <p className="mt-1">Boias são acessórios recreativos e não substituem coletes salva-vidas nem a supervisão constante de adultos.</p>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="mt-6 rounded-3xl border border-sky-100 bg-white p-5 text-sm text-sky-900/75 shadow-sm">
            <p className="font-black text-sky-950">Precisa de ajuda?</p>
            <p className="mt-1">Fale com a gente em <a className="font-bold text-sky-700 underline underline-offset-2" href="mailto:contato@mambobaby.com.br">contato@mambobaby.com.br</a>, de segunda a sexta, das 9h às 18h.</p>
          </div>
        </Reveal>
      </main>
    </Layout>
  )
}

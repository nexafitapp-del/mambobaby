import { useId, useRef, useState } from 'react'
import { AlertCircle, Check, Loader2, MapPin, Search, ShieldCheck, UserRound } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type DadosCliente = {
  nome: string
  email: string
  telefone: string
  cep: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
}

export const dadosVazios: DadosCliente = {
  nome: '', email: '', telefone: '', cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '',
}

export const soDigitos = (v: string) => v.replace(/\D+/g, '')

export function mascararTelefone(valor: string) {
  const d = soDigitos(valor).slice(0, 11)
  if (!d) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function mascararCep(valor: string) {
  const d = soDigitos(valor).slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

/** Valida os dados obrigatórios e devolve a mensagem de erro (ou null se estiver tudo certo). */
export function validarDados(d: DadosCliente): string | null {
  if (d.nome.trim().length < 3) return 'Informe seu nome completo.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) return 'Informe um e-mail válido para receber o pedido.'
  if (soDigitos(d.telefone).length < 10) return 'Informe um celular com DDD.'
  if (soDigitos(d.cep).length !== 8) return 'Informe um CEP válido com 8 dígitos.'
  if (!d.rua.trim()) return 'Confira a rua do endereço de entrega.'
  if (!d.numero.trim()) return 'Informe o número do endereço.'
  if (!d.bairro.trim()) return 'Confira o bairro do endereço.'
  if (!d.cidade.trim() || d.uf.trim().length !== 2) return 'Confira cidade e estado do endereço.'
  return null
}

type RespostaCep = {
  erro?: boolean | string
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
}

type Props = {
  dados: DadosCliente
  onChange: (d: DadosCliente) => void
}

const classeCampo =
  'h-11 rounded-xl border-sky-200 bg-white font-medium focus-visible:border-sky-500'

export function Checkout({ dados, onChange }: Props) {
  const id = useId()
  const [buscando, setBuscando] = useState(false)
  const [erroCep, setErroCep] = useState('')
  const [cepOk, setCepOk] = useState(false)
  const numeroRef = useRef<HTMLInputElement>(null)

  const set = (campo: keyof DadosCliente, valor: string) => onChange({ ...dados, [campo]: valor })

  async function buscarCep(valor = dados.cep) {
    const cep = soDigitos(valor)
    if (cep.length !== 8) {
      setCepOk(false)
      setErroCep('O CEP precisa ter 8 dígitos.')
      return
    }
    setBuscando(true)
    setErroCep('')
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      if (!resposta.ok) throw new Error('falha na consulta')
      const end = (await resposta.json()) as RespostaCep
      if (end.erro) {
        setCepOk(false)
        setErroCep('CEP não encontrado. Confira os números.')
        return
      }
      onChange({
        ...dados,
        cep: mascararCep(cep),
        rua: end.logradouro || dados.rua,
        bairro: end.bairro || dados.bairro,
        cidade: end.localidade || dados.cidade,
        uf: (end.uf || dados.uf).toUpperCase().slice(0, 2),
      })
      setCepOk(true)
      // leva o foco direto para o número, único dado que o CEP não traz
      window.setTimeout(() => numeroRef.current?.focus(), 50)
    } catch {
      setCepOk(false)
      setErroCep('Não foi possível buscar o CEP agora. Preencha o endereço manualmente.')
    } finally {
      setBuscando(false)
    }
  }

  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Dados de entrega</legend>

      <div className="flex items-center gap-2 text-sky-900">
        <span className="grid size-7 place-items-center rounded-full bg-sky-100 text-sky-700">
          <UserRound className="size-4" aria-hidden />
        </span>
        <h3 className="text-sm font-black tracking-wide">1. Seus dados</h3>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor={`${id}-nome`} className="text-xs font-bold text-sky-900/70">Nome completo *</Label>
          <Input
            id={`${id}-nome`}
            value={dados.nome}
            onChange={(e) => set('nome', e.target.value)}
            autoComplete="name"
            placeholder="Como no documento"
            className={classeCampo}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${id}-email`} className="text-xs font-bold text-sky-900/70">E-mail *</Label>
          <Input
            id={`${id}-email`}
            type="email"
            inputMode="email"
            value={dados.email}
            onChange={(e) => set('email', e.target.value)}
            autoComplete="email"
            placeholder="voce@email.com"
            className={classeCampo}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${id}-tel`} className="text-xs font-bold text-sky-900/70">Celular / WhatsApp *</Label>
          <Input
            id={`${id}-tel`}
            type="tel"
            inputMode="tel"
            value={dados.telefone}
            onChange={(e) => set('telefone', mascararTelefone(e.target.value))}
            autoComplete="tel-national"
            placeholder="(11) 91234-5678"
            className={classeCampo}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sky-900">
        <span className="grid size-7 place-items-center rounded-full bg-sky-100 text-sky-700">
          <MapPin className="size-4" aria-hidden />
        </span>
        <h3 className="text-sm font-black tracking-wide">2. Endereço de entrega</h3>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-6">
        <div className="grid gap-1.5 sm:col-span-3">
          <Label htmlFor={`${id}-cep`} className="text-xs font-bold text-sky-900/70">CEP *</Label>
          <div className="relative">
            <Input
              id={`${id}-cep`}
              inputMode="numeric"
              value={dados.cep}
              onChange={(e) => {
                set('cep', mascararCep(e.target.value))
                if (erroCep) setErroCep('')
                setCepOk(false)
              }}
              onBlur={() => { if (soDigitos(dados.cep).length === 8) void buscarCep() }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); void buscarCep() }
              }}
              autoComplete="postal-code"
              placeholder="00000-000"
              aria-invalid={Boolean(erroCep)}
              aria-describedby={`${id}-cep-msg`}
              className={cn(classeCampo, 'pr-10')}
            />
            {buscando && <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-sky-500" aria-hidden />}
            {!buscando && cepOk && <Check className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-emerald-600" aria-hidden />}
          </div>
        </div>
        <div className="sm:col-span-3 sm:self-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => void buscarCep()}
            disabled={buscando}
            className="h-11 w-full rounded-xl border-sky-300 font-black text-sky-800 hover:bg-sky-50"
          >
            {buscando ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Buscando…</> : <><Search className="size-4" aria-hidden /> Buscar CEP</>}
          </Button>
        </div>

        <div className="grid gap-1.5 sm:col-span-4">
          <Label htmlFor={`${id}-rua`} className="text-xs font-bold text-sky-900/70">Rua / Avenida *</Label>
          <Input
            id={`${id}-rua`}
            value={dados.rua}
            onChange={(e) => set('rua', e.target.value)}
            autoComplete="address-line1"
            placeholder="Preenchido pelo CEP"
            className={classeCampo}
          />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor={`${id}-numero`} className="text-xs font-bold text-sky-900/70">Número *</Label>
          <Input
            ref={numeroRef}
            id={`${id}-numero`}
            value={dados.numero}
            onChange={(e) => set('numero', e.target.value)}
            inputMode="numeric"
            placeholder="123"
            className={classeCampo}
          />
        </div>
        <div className="grid gap-1.5 sm:col-span-3">
          <Label htmlFor={`${id}-comp`} className="text-xs font-bold text-sky-900/70">Complemento</Label>
          <Input
            id={`${id}-comp`}
            value={dados.complemento}
            onChange={(e) => set('complemento', e.target.value)}
            autoComplete="address-line2"
            placeholder="Apto, bloco (opcional)"
            className={classeCampo}
          />
        </div>
        <div className="grid gap-1.5 sm:col-span-3">
          <Label htmlFor={`${id}-bairro`} className="text-xs font-bold text-sky-900/70">Bairro *</Label>
          <Input
            id={`${id}-bairro`}
            value={dados.bairro}
            onChange={(e) => set('bairro', e.target.value)}
            placeholder="Preenchido pelo CEP"
            className={classeCampo}
          />
        </div>
        <div className="grid gap-1.5 sm:col-span-4">
          <Label htmlFor={`${id}-cidade`} className="text-xs font-bold text-sky-900/70">Cidade *</Label>
          <Input
            id={`${id}-cidade`}
            value={dados.cidade}
            onChange={(e) => set('cidade', e.target.value)}
            autoComplete="address-level2"
            placeholder="Preenchida pelo CEP"
            className={classeCampo}
          />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor={`${id}-uf`} className="text-xs font-bold text-sky-900/70">UF *</Label>
          <Input
            id={`${id}-uf`}
            value={dados.uf}
            onChange={(e) => set('uf', e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2))}
            autoComplete="address-level1"
            placeholder="SP"
            className={cn(classeCampo, 'uppercase')}
          />
        </div>
      </div>

      <p id={`${id}-cep-msg`} aria-live="polite" className="mt-2 text-xs">
        {erroCep ? (
          <span className="inline-flex items-start gap-1.5 font-bold text-red-600">
            <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden /> {erroCep}
          </span>
        ) : (
          <span className="text-sky-900/55">Digite o CEP que preenchemos rua, bairro, cidade e estado automaticamente.</span>
        )}
      </p>

      <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-sky-50 p-3 text-[11px] leading-relaxed text-sky-900/70 ring-1 ring-sky-100">
        <ShieldCheck className="mt-px size-3.5 shrink-0 text-sky-600" aria-hidden />
        Seus dados são usados apenas para processar e entregar o pedido.
      </p>
    </fieldset>
  )
}

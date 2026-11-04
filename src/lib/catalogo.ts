// Vitrine: lê os produtos e kits cadastrados no painel, com reserva no arquivo local.
import { loja as lojaLocal } from '@/lib/loja'
import { api, SUPABASE_URL } from '@/lib/supabase'
import type { Oferta as OfertaDb, Produto as ProdutoDb } from '@/lib/admin'

export type KitVitrine = { id: string; nome: string; qtd: number; desconto: number; destaque: boolean }

export type ProdutoVitrine = {
  id: string
  nome: string
  descricao: string | null
  preco: number
  preco_original: number | null
  imagens: string[]
  kits: KitVitrine[]
}

export type Vitrine = {
  produtos: ProdutoVitrine[]
  carregando: boolean
  origem: 'banco' | 'local'
}

const OFERTAS_LOCAIS = lojaLocal.ofertas.map((o) => ({ ...o }))

export const produtoLocal: ProdutoVitrine = {
  id: 'local',
  nome: 'Boia MamboBaby Classic com Cauda e Proteção FPU 50+',
  descricao: 'Diversão, cores e momentos especiais para toda a família. Escolha a quantidade ideal e economize no kit.',
  preco: lojaLocal.precoUnitario,
  preco_original: lojaLocal.precoOriginal,
  imagens: [],
  kits: OFERTAS_LOCAIS,
}

export function urlImagem(caminho: string) {
  if (/^https?:\/\//i.test(caminho)) return caminho
  return `${SUPABASE_URL}/storage/v1/object/public/produtos/${caminho.split('/').map(encodeURIComponent).join('/')}`
}

type ProdutoCru = ProdutoDb & { imagens?: string[] | null }

function montar(ps: ProdutoCru[], os: OfertaDb[]): ProdutoVitrine[] {
  return ps.map((p) => ({
    id: p.id,
    nome: p.nome,
    descricao: p.descricao,
    preco: Number(p.preco),
    preco_original: p.preco_original ? Number(p.preco_original) : null,
    imagens: (p.imagens ?? []).filter(Boolean),
    kits: os
      .filter((o) => o.produto_id === p.id && o.ativo)
      .sort((a, b) => a.ordem - b.ordem)
      .map((o) => ({ id: o.id, nome: o.nome, qtd: o.qtd, desconto: Number(o.desconto_pct), destaque: o.destaque })),
  }))
}

/** Busca a vitrine pública. Qualquer falha cai no catálogo local, sem quebrar a página. */
export async function carregarVitrine(): Promise<{ produtos: ProdutoVitrine[]; origem: 'banco' | 'local' }> {
  try {
    const [ps, os] = await Promise.all([
      api<ProdutoCru[]>('/rest/v1/produtos?select=*&ativo=eq.true&order=criado_em.asc'),
      api<OfertaDb[]>('/rest/v1/ofertas?select=*&ativo=eq.true&order=ordem.asc'),
    ])
    const lista = montar(ps, os)
    if (!lista.length) return { produtos: [produtoLocal], origem: 'local' }
    return { produtos: lista, origem: 'banco' }
  } catch {
    return { produtos: [produtoLocal], origem: 'local' }
  }
}

export type Calculo = ReturnType<typeof calcularKit>

export function calcularKit(
  precoUnitario: number,
  precoOriginal: number | null,
  qtd: number,
  descontoKit: number,
  cupomPct = 0,
) {
  const bruto = Math.round(precoUnitario * qtd * 100)
  const aposKit = Math.round(bruto * (1 - descontoKit / 100))
  const total = Math.round(aposKit * (1 - cupomPct / 100))
  const originalUnit = precoOriginal && precoOriginal > precoUnitario ? precoOriginal : precoUnitario
  const original = Math.round(originalUnit * qtd * 100) / 100
  return {
    bruto: bruto / 100,
    total: total / 100,
    porUnidade: total / qtd / 100,
    original,
    economia: Math.max(0, Math.round((original * 100 - total) / 100) / 100),
    descontoTotal: original > 0 ? Math.round((100 - (total / (original * 100)) * 100) * 100) / 100 : 0,
    parcelas: 12,
    parcela: Math.round((total / 12) * 100) / 100,
  }
}

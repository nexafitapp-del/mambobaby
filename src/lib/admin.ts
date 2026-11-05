import { api, rpc, SUPABASE_KEY, SUPABASE_URL } from '@/lib/supabase'

export const supabaseConfigurado = true

/* Modo painel aberto: sem e-mail e sem senha. O acesso é feito com a chave
   publicável do projeto e as regras do banco liberam o catálogo. */
export const TOKEN_PAINEL = SUPABASE_KEY

const tabela = (nome: string) => `/rest/v1/${nome}`

export type Produto = {
  id: string
  descricao: string | null
  preco: number
  preco_original: number | null
  ativo: boolean
  imagens: string[] | null
  ordem?: number
  criado_em: string
}

export type Oferta = {
  id: string
  produto_id: string
  nome: string
  qtd: number
  desconto_pct: number
  destaque: boolean
  ativo: boolean
  ordem: number
}

export const listarProdutosPublico = () =>
  api<Produto[]>(`${tabela('produtos')}?select=*&ativo=eq.true&order=criado_em.desc`)

export const listarOfertasPublico = () =>
  api<Oferta[]>(`${tabela('ofertas')}?select=*&ativo=eq.true&order=ordem.asc`)

export const listarProdutos = () =>
  api<Produto[]>(`${tabela('produtos')}?select=*&order=criado_em.desc`)

export const listarOfertas = () =>
  api<Oferta[]>(`${tabela('ofertas')}?select=*&order=ordem.asc`)

/* Só as colunas que existem na tabela: evita erro de campo desconhecido. */
function limparProduto(p: Partial<Produto>) {
  const corpo: Record<string, unknown> = {}
  if (p.nome !== undefined) corpo.nome = p.nome
  if (p.descricao !== undefined) corpo.descricao = p.descricao
  if (p.preco !== undefined) corpo.preco = p.preco
  if (p.preco_original !== undefined) corpo.preco_original = p.preco_original
  if (p.ativo !== undefined) corpo.ativo = p.ativo
  if (p.imagens !== undefined) corpo.imagens = (p.imagens ?? []).filter(Boolean)
  return corpo
}

export const criarProduto = (p: Partial<Produto>) =>
  api<Produto[]>(tabela('produtos'), { metodo: 'POST', corpo: limparProduto(p) })

export const atualizarProduto = (id: string, p: Partial<Produto>) =>
  api<Produto[]>(`${tabela('produtos')}?id=eq.${id}`, { metodo: 'PATCH', corpo: limparProduto(p) })

export const excluirProduto = (id: string) =>
  api<null>(`${tabela('produtos')}?id=eq.${id}`, { metodo: 'DELETE', retorno: false })

export const removerImagensDoProduto = async (id: string, caminhos: string[]) => {
  for (const caminho of caminhos) {
    try {
      await removerImagem(caminho)
    } catch {
      /* arquivo órfão: não impede a exclusão do produto */
    }
  }
  return id
}

export const criarOferta = (o: Partial<Oferta>) =>
  api<Oferta[]>(tabela('ofertas'), { metodo: 'POST', corpo: o })

export const atualizarOferta = (id: string, o: Partial<Oferta>) =>
  api<Oferta[]>(`${tabela('ofertas')}?id=eq.${id}`, { metodo: 'PATCH', corpo: o })

export const excluirOferta = (id: string) =>
  api<null>(`${tabela('ofertas')}?id=eq.${id}`, { metodo: 'DELETE', retorno: false })

/* Redefinir a senha do painel continua disponível no banco, mas não é mais
   exigido para entrar. */
export async function trocarSenha(atual: string, nova: string): Promise<void> {
  await rpc<boolean>('redefinir_senha_admin', { p_atual: atual, p_nova: nova })
}

/* ---------- Imagens no Storage (bucket "produtos") ---------- */

const BUCKET = 'produtos'
const TIPOS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}
const LIMITE = 5 * 1024 * 1024

export async function enviarImagem(arquivo: File, prefixo = 'produto'): Promise<string> {
  const tipo = arquivo.type.toLowerCase()
  const ext = TIPOS[tipo]
  if (!ext) throw new Error('Formato não aceito. Envie JPG, PNG, WEBP ou AVIF.')
  if (arquivo.size > LIMITE) throw new Error('A imagem passa de 5 MB. Reduza ou otimize antes de enviar.')

  const seguro = arquivo.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 40) || 'foto'
  const caminho = `${prefixo}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${seguro}.${ext}`

  const resposta = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${caminho.split('/').map(encodeURIComponent).join('/')}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': tipo,
      'cache-control': '3600',
      'x-upsert': 'true',
    },
    body: arquivo,
  })

  if (!resposta.ok) {
    const texto = await resposta.text()
    let msg = `O envio da foto foi recusado (${resposta.status}).`
    try {
      const obj = JSON.parse(texto) as Record<string, unknown>
      msg = (obj.message as string) || (obj.error_description as string) || (obj.error as string) || msg
    } catch {
      if (texto) msg = `${msg} ${texto.slice(0, 160)}`
    }
    throw new Error(msg)
  }
  return caminho
}

export async function removerImagem(caminho: string) {
  if (/^https?:\/\//i.test(caminho)) return
  const resposta = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${caminho.split('/').map(encodeURIComponent).join('/')}`, {
    method: 'DELETE',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  if (!resposta.ok && resposta.status !== 404) {
    throw new Error(`A foto não pôde ser removida (${resposta.status}).`)
  }
}

export type ConfigLoja = {
  id: number
  nome_loja: string
  slogan: string
  preco_unitario: number
  preco_original: number
  cupons: Record<string, number>
}

export const buscarConfig = () =>
  api<ConfigLoja[]>(`${tabela('configuracoes')}?select=*&id=eq.1`).then((r) => r[0])

export const salvarConfig = (c: Partial<ConfigLoja>) =>
  api<ConfigLoja[]>(`${tabela('configuracoes')}?id=eq.1`, {
    metodo: 'PATCH',
    corpo: { ...c, atualizado_em: new Date().toISOString() },
  })

export const buscarPedidos = (): Promise<Pedido[]> => Promise.resolve([])

/* Diagnóstico: abre uma conexão direta e devolve status e mensagem reais. */
export async function testarConexao(): Promise<string> {
  const inicio = Date.now()
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/produtos?select=id&limit=1`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    })
    const ms = Date.now() - inicio
    const texto = (await r.text()).slice(0, 300)
    return `HTTP ${r.status} em ${ms} ms · ${texto || '(sem corpo)'}`
  } catch (e) {
    const ms = Date.now() - inicio
    return `Sem resposta em ${ms} ms · ${e instanceof Error ? e.name + ': ' + e.message : String(e)}`
  }
}

export function painelAberto() {
  return true
}

export function produtosAdminHref() {
  return '/admin'
}

export type Pedido = {
  id: string
  cliente_id: string | null
  status: string
  total: number | null
  criado_em: string
}

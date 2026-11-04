import { api, rpc, SUPABASE_KEY, SUPABASE_URL } from '@/lib/supabase'

const CHAVE = 'mambobaby.admin.sessao'

export type Sessao = { email: string; token: string }

export const supabaseConfigurado = true

export function sessaoSalva(): Sessao | null {
  try {
    const cru = localStorage.getItem(CHAVE)
    if (!cru) return null
    const s = JSON.parse(cru) as Sessao
    if (!s?.token || !s?.email) return null
    const parte = s.token.split('.')[1]
    const exp = JSON.parse(atob(parte.replace(/-/g, '+').replace(/_/g, '/'))).exp as number
    if (exp * 1000 < Date.now()) {
      localStorage.removeItem(CHAVE)
      return null
    }
    return s
  } catch {
    return null
  }
}

export function salvarSessao(s: Sessao) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(s))
  } catch {
    /* armazenamento indisponível */
  }
}

export function sair() {
  try {
    localStorage.removeItem(CHAVE)
  } catch {
    /* armazenamento indisponível */
  }
}

export async function entrar(email: string, senha: string): Promise<Sessao> {
  const token = await rpc<string | null>('admin_login', { p_email: email.trim(), p_senha: senha })
  if (!token) throw new Error('E-mail ou senha incorretos.')
  const sessao = { email: email.trim().toLowerCase(), token }
  salvarSessao(sessao)
  return sessao
}

export type Produto = {
  id: string
  nome: string
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

type Token = string

const tabela = (nome: string) => `/rest/v1/${nome}`

export const listarProdutos = (token: Token) =>
  api<Produto[]>(`${tabela('produtos')}?select=*&order=criado_em.desc`, { token })

export const listarOfertas = (token: Token) =>
  api<Oferta[]>(`${tabela('ofertas')}?select=*&order=ordem.asc`, { token })

export const criarProduto = (token: Token, p: Partial<Produto>) =>
  api<Produto[]>(tabela('produtos'), { metodo: 'POST', token, corpo: p })

export const atualizarProduto = (token: Token, id: string, p: Partial<Produto>) =>
  api<Produto[]>(`${tabela('produtos')}?id=eq.${id}`, { metodo: 'PATCH', token, corpo: p })

export const excluirProduto = (token: Token, id: string) =>
  api<null>(`${tabela('produtos')}?id=eq.${id}`, { metodo: 'DELETE', token })

export const criarOferta = (token: Token, o: Partial<Oferta>) =>
  api<Oferta[]>(tabela('ofertas'), { metodo: 'POST', token, corpo: o })

export const atualizarOferta = (token: Token, id: string, o: Partial<Oferta>) =>
  api<Oferta[]>(`${tabela('ofertas')}?id=eq.${id}`, { metodo: 'PATCH', token, corpo: o })

export const excluirOferta = (token: Token, id: string) =>
  api<null>(`${tabela('ofertas')}?id=eq.${id}`, { metodo: 'DELETE', token })

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

export async function enviarImagem(token: Token, arquivo: File, prefixo = 'produto'): Promise<string> {
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
      Authorization: `Bearer ${token}`,
      'Content-Type': tipo,
      'cache-control': 'max-age=31536000, public',
      'x-upsert': 'false',
    },
    body: arquivo,
  })

  if (!resposta.ok) {
    const texto = await resposta.text()
    let msg = 'Não foi possível enviar a imagem.'
    try {
      const obj = JSON.parse(texto) as Record<string, unknown>
      msg = (obj.message as string) || (obj.error_description as string) || msg
    } catch {
      /* resposta sem JSON */
    }
    throw new Error(msg)
  }
  return caminho
}

export async function removerImagem(token: Token, caminho: string) {
  if (/^https?:\/\//i.test(caminho)) return
  await api<null>(`/storage/v1/object/${BUCKET}/${caminho.split('/').map(encodeURIComponent).join('/')}`, {
    metodo: 'DELETE',
    token,
  })
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
  api<ConfigLoja[]>(`${tabela('configuracoes')}?select=*&id=eq.1`) .then((r) => r[0])

export const salvarConfig = (token: Token, c: Partial<ConfigLoja>) =>
  api<ConfigLoja[]>(`${tabela('configuracoes')}?id=eq.1`, {
    metodo: 'PATCH',
    token,
    corpo: { ...c, atualizado_em: new Date().toISOString() },
  })

export type Pedido = {
  id: string
  cliente_id: string | null
  status: string
  total: number | null
  criado_em: string
}

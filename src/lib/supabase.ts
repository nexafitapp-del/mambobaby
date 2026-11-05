// Cliente mínimo do Supabase (REST), sem dependências externas.
// A chave abaixo é a chave publicável do projeto; a proteção real vem das políticas RLS.
export const SUPABASE_URL = 'https://chxejjljmomgtufggflv.supabase.co'
export const SUPABASE_KEY = 'sb_publishable_RgMXWlM7Km3ipZ8s5c6jSg_5S6GwVg4'

export class ErroApi extends Error {}

type Opcoes = { metodo?: string; corpo?: unknown; token?: string | null; retorno?: boolean; cabecalhos?: Record<string, string> }

function lerErro(texto: string): string | null {
  if (!texto) return null
  try {
    const obj = JSON.parse(texto) as Record<string, unknown>
    const msg = (obj.message || obj.hint || obj.error_description || obj.error) as string | undefined
    if (msg) return String(msg)
    return null
  } catch {
    return texto.slice(0, 200)
  }
}

function descreverFalhaDeRede(erro: unknown): string {
  const nome = (erro as { name?: string } | null)?.name
  const detalhe = erro instanceof Error ? erro.message : ''
  if (nome === 'AbortError') {
    return 'O serviço de dados demorou demais para responder. Tente de novo.'
  }
  if (/Failed to fetch|NetworkError|load failed|Network request failed/i.test(detalhe)) {
    return 'A operação não pôde ser concluída agora. Tente de novo em alguns segundos.'
  }
  return `A operação não pôde ser concluída agora${detalhe ? ` (${detalhe})` : ''}. Tente de novo.`
}

export async function api<T = unknown>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
  const { metodo = 'GET', corpo, token, retorno = true, cabecalhos } = opcoes
  const headers: Record<string, string> = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${token || SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    ...cabecalhos,
  }
  if (retorno) headers.Prefer = 'return=representation'

  const controller = new AbortController()
  const relogio = setTimeout(() => controller.abort(), 20000)
  let resposta: Response
  try {
    resposta = await fetch(`${SUPABASE_URL}${caminho}`, {
      method: metodo,
      headers,
      signal: controller.signal,
      cache: 'no-store',
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    })
  } catch (erro) {
    throw new ErroApi(descreverFalhaDeRede(erro))
  } finally {
    clearTimeout(relogio)
  }

  const texto = await resposta.text()

  if (!resposta.ok) {
    const detalhe = lerErro(texto)
    if (resposta.status === 401 || resposta.status === 403) {
      throw new ErroApi(detalhe ? `Acesso recusado pelo banco: ${detalhe}` : 'Acesso recusado pelo banco de dados (401/403).')
    }
    if (resposta.status === 404) {
      throw new ErroApi(detalhe ? `Recurso não encontrado no banco: ${detalhe}` : `Recurso não encontrado no banco: ${caminho}`)
    }
    if (resposta.status >= 500) {
      throw new ErroApi(detalhe ? `O serviço de dados falhou (${resposta.status}): ${detalhe}` : `O serviço de dados falhou (${resposta.status}).`)
    }
    throw new ErroApi(detalhe ? `O banco recusou a operação (${resposta.status}): ${detalhe}` : `O banco recusou a operação (${resposta.status}).`)
  }

  if (!texto) return null as T
  try {
    return JSON.parse(texto) as T
  } catch {
    return texto as unknown as T
  }
}

export function rpc<T = unknown>(nome: string, args: Record<string, unknown>, token?: string | null) {
  return api<T>(`/rest/v1/rpc/${nome}`, { metodo: 'POST', corpo: args, token })
}

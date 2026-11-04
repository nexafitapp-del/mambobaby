// Cliente mínimo do Supabase (REST), sem dependências externas.
// A chave abaixo é a chave publicável do projeto; a proteção real vem das políticas RLS.
export const SUPABASE_URL = 'https://chxejjljmomgtufggflv.supabase.co'
export const SUPABASE_KEY = 'sb_publishable_RgMXWlM7Km3ipZ8s5c6jSg_5S6GwVg4'

export class ErroApi extends Error {}

type Opcoes = { metodo?: string; corpo?: unknown; token?: string | null; texto?: boolean }

export async function api<T = unknown>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
  const { metodo = 'GET', corpo, token, texto: modoTexto } = opcoes
  const headers: Record<string, string> = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' }
  headers.Authorization = `Bearer ${token || SUPABASE_KEY}`

  let resposta: Response | null = null
  let falha: unknown = null
  /* Duas tentativas em rotas diferentes: se o primeiro caminho for barrado
     (rede, proxy, bloqueio), o segundo ainda pode funcionar. */
  for (let tentativa = 0; tentativa < 2 && !resposta; tentativa++) {
    const controller = new AbortController()
    const relogio = setTimeout(() => controller.abort(), 15000)
    try {
      resposta = await fetch(`${SUPABASE_URL}${caminho}`, {
        method: modoTexto && tentativa === 1 ? 'POST' : metodo,
        headers: modoTexto && tentativa === 1 ? { ...headers, 'x-http-method-override': 'GET' } : headers,
        signal: controller.signal,
        body: modoTexto && tentativa === 1 ? '{}' : corpo === undefined ? undefined : JSON.stringify(corpo),
      })
    } catch (erro) {
      falha = erro
      await new Promise((r) => setTimeout(r, 400))
    } finally {
      clearTimeout(relogio)
    }
  }

  if (!resposta) {
    const abortado = (falha as { name?: string } | null)?.name === 'AbortError'
    throw new ErroApi(
      abortado
        ? 'O servidor demorou demais para responder. Tente novamente em alguns segundos.'
        : 'Não foi possível conectar ao servidor de dados. Verifique sua internet e tente novamente.',
    )
  }

  const texto = await resposta.text()
  let dados: unknown = null
  if (texto) {
    try {
      dados = JSON.parse(texto)
    } catch {
      dados = texto
    }
  }

  if (!resposta.ok) {
    const obj = dados as Record<string, unknown> | null
    const msg = (obj && (obj.message || obj.hint || obj.error_description)) as string | undefined
    throw new ErroApi(msg || 'Falha na comunicação com o servidor.')
  }
  return dados as T
}

export function rpc<T = unknown>(nome: string, args: Record<string, unknown>, token?: string | null) {
  return api<T>(`/rest/v1/rpc/${nome}`, { metodo: 'POST', corpo: args, token })
}

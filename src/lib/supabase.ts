// Cliente mínimo do Supabase (REST), sem dependências externas.
// A chave abaixo é a chave publicável do projeto; a proteção real vem das políticas RLS.
export const SUPABASE_URL = 'https://chxejjljmomgtufggflv.supabase.co'
export const SUPABASE_KEY = 'sb_publishable_RgMXWlM7Km3ipZ8s5c6jSg_5S6GwVg4'

export class ErroApi extends Error {}

type Opcoes = { metodo?: string; corpo?: unknown; token?: string | null }

export async function api<T = unknown>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
  const { metodo = 'GET', corpo, token } = opcoes
  const headers: Record<string, string> = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' }
  headers.Authorization = `Bearer ${token || SUPABASE_KEY}`

  let resposta: Response
  try {
    resposta = await fetch(`${SUPABASE_URL}${caminho}`, {
      method: metodo,
      headers,
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    })
  } catch {
    throw new ErroApi(
      'Não consegui falar com o servidor. Verifique sua conexão (ou bloqueador de anúncios/VPN) e tente de novo.',
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

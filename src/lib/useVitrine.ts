// Carrega o catálogo do banco (com reserva no arquivo local).
import { useEffect, useState } from 'react'
import { carregarVitrine, produtosLocais, type ProdutoVitrine, type Vitrine } from '@/lib/catalogo'

type Resultado = { produtos: ProdutoVitrine[]; origem: 'banco' | 'local' }

let cache: Resultado | null = null
let emAndamento: Promise<Resultado> | null = null

export function useVitrine(): Vitrine & { recarregar: () => void } {
  const [dados, setDados] = useState<Resultado | null>(cache)
  const [carregando, setCarregando] = useState(!cache)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let vivo = true
    if (cache) {
      setDados(cache)
      setCarregando(false)
      return
    }
    setCarregando(true)
    emAndamento = emAndamento ?? carregarVitrine()
    void emAndamento.then((r) => {
      cache = r
      emAndamento = null
      if (!vivo) return
      setDados(r)
      setCarregando(false)
    })
    return () => {
      vivo = false
    }
  }, [tentativa])

  return {
    produtos: dados?.produtos ?? produtosLocais,
    carregando,
    origem: dados?.origem ?? 'local',
    recarregar: () => {
      cache = null
      emAndamento = null
      setTentativa((n) => n + 1)
    },
  }
}

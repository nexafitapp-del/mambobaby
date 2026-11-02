// Configuração comercial inicial da MamboBaby.
// Valores de preço são iniciais e devem ser ajustados pelo proprietário (futuro painel admin).
export const loja = {
  nome: 'MamboBaby',
  slogan: 'A diversão começa aqui!',
  precoUnitario: 99.9,
  precoOriginal: 129.9,
  cupons: { MAMBO10: 10 } as Record<string, number>, // % de desconto
  ofertas: [
    { id: 'unidade', nome: 'Unidade', qtd: 1, desconto: 0, destaque: false },
    { id: 'duplo', nome: 'Kit Duplo', qtd: 2, desconto: 8, destaque: false },
    { id: 'familia', nome: 'Kit Família', qtd: 3, desconto: 15, destaque: true },
  ],
}

export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function calcular(qtd: number, descontoKit: number, cupomPct = 0) {
  const bruto = Math.round(loja.precoUnitario * qtd * 100)
  const aposKit = Math.round(bruto * (1 - descontoKit / 100))
  const total = Math.round(aposKit * (1 - cupomPct / 100))
  return { bruto: bruto / 100, total: total / 100, porUnidade: total / qtd / 100, original: loja.precoOriginal * qtd }
}

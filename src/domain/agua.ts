// Meta diária de água (ml) que a equipe define no painel.

/** Meta válida: número inteiro de 500 a 6.000 ml. */
export const metaAguaValida = (v: string) => {
  const ml = Number(v)
  return Number.isInteger(ml) && ml >= 500 && ml <= 6000
}

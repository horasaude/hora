// Material de apoio por profissional: nutrição (Plano alimentar) ou saúde (Dra. Clara, menu Saúde).

export type AreaMaterial = 'nutricao' | 'saude'

export const caminhoMateriais = (area: AreaMaterial) =>
  area === 'saude' ? '/app/admin/saude/materiais' : '/app/admin/plano/materiais'

import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { salvarCardapio, type Cardapio } from '../api/modulos.api'
import { useSalvar } from '../hooks/usePainel'
import { REFEICOES } from '../refeicoes'
import { ROTULOS_REFEICOES } from '../rotulosRefeicoes'
import { esquemaCardapio } from '../schemas/modulos'
import { textos } from '../textos'
import { FormAgenda, type CampoDef } from './FormAgenda'

const t = textos.cardapios
type Entrada = z.input<typeof esquemaCardapio>
const CAMPOS: CampoDef<Entrada>[] = [
  { nome: 'objetivo', rotulo: t.campoObjetivo, sugestoes: t.objetivos },
  { nome: 'titulo', rotulo: t.campoTitulo },
  { nome: 'descricao', rotulo: t.campoDescricao, tipo: 'area' },
  ...REFEICOES.map((nome, i) => ({
    nome,
    rotulo: ROTULOS_REFEICOES[i] ?? nome,
    tipo: 'area' as const,
    largura: 'meia' as const,
  })),
  { nome: 'lista_compras', rotulo: t.listaCompras, tipo: 'area' },
]

/** Janela de criar ou editar cardápio: objetivo e título lado a lado, refeições em duas colunas. */
export function CardapioForm({
  cardapio,
  aoFechar,
}: {
  cardapio?: Cardapio
  aoFechar: () => void
}) {
  const salvar = useSalvar(salvarCardapio)
  const navegar = useNavigate()
  const c = cardapio
  return (
    <FormAgenda<Entrada, z.output<typeof esquemaCardapio>>
      titulo={c ? t.editar : t.novo}
      campos={CAMPOS}
      inicial={{
        objetivo: c?.objetivo ?? '',
        titulo: c?.titulo ?? '',
        descricao: c?.descricao ?? '',
        cafe: c?.cafe ?? '',
        lanche_manha: c?.lanche_manha ?? '',
        almoco: c?.almoco ?? '',
        lanche_tarde: c?.lanche_tarde ?? '',
        jantar: c?.jantar ?? '',
        ceia: c?.ceia ?? '',
        lista_compras: c?.lista_compras ?? '',
      }}
      resolver={zodResolver(esquemaCardapio)}
      aoCancelar={aoFechar}
      aoSalvar={async (d) => {
        const salvo = await salvar.mutateAsync({ ...d, id: c?.id })
        if (c) aoFechar()
        else navegar(`/app/admin/cardapios/${salvo.id}`)
      }}
    />
  )
}

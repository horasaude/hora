import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { salvarCardapio, type Cardapio } from '../api/modulos.api'
import { useSalvar } from '../hooks/usePainel'
import { REFEICOES, refeicoesPreenchidas } from '../refeicoes'
import { esquemaCardapio } from '../schemas/modulos'
import { textos } from '../textos'
import { BotaoPublicar } from './BotaoPublicar'
import { CartaoDetalhe, Dados } from './CartaoDetalhe'
import { FormAgenda, type CampoDef } from './FormAgenda'
import { Situacao } from './Tabela'

const t = textos.cardapios
type Entrada = z.input<typeof esquemaCardapio>
const ROTULOS = [t.cafe, t.lancheManha, t.almoco, t.lancheTarde, t.jantar, t.ceia]
const CAMPOS: CampoDef<Entrada>[] = [
  { nome: 'objetivo', rotulo: t.campoObjetivo, sugestoes: t.objetivos },
  { nome: 'titulo', rotulo: t.campoTitulo },
  { nome: 'descricao', rotulo: t.campoDescricao, tipo: 'area' },
  ...REFEICOES.map((nome, i) => ({ nome, rotulo: ROTULOS[i] ?? nome, tipo: 'area' as const })),
  { nome: 'lista_compras', rotulo: t.listaCompras, tipo: 'area' },
]

/** Cartão do cardápio aberto (ou novo): dados, publicar e o formulário. */
export function CardapioDetalhe({ cardapio }: { cardapio?: Cardapio }) {
  const salvar = useSalvar(salvarCardapio)
  const navegar = useNavigate()
  const inicial: Entrada = {
    objetivo: cardapio?.objetivo ?? '',
    titulo: cardapio?.titulo ?? '',
    descricao: cardapio?.descricao ?? '',
    cafe: cardapio?.cafe ?? '',
    lanche_manha: cardapio?.lanche_manha ?? '',
    almoco: cardapio?.almoco ?? '',
    lanche_tarde: cardapio?.lanche_tarde ?? '',
    jantar: cardapio?.jantar ?? '',
    ceia: cardapio?.ceia ?? '',
    lista_compras: cardapio?.lista_compras ?? '',
  }
  return (
    <CartaoDetalhe titulo={cardapio ? cardapio.titulo : t.novo}>
      {cardapio && (
        <>
          <Dados
            itens={[
              [t.campoObjetivo, cardapio.objetivo],
              [t.colunaRefeicoes, t.refeicoes(refeicoesPreenchidas(cardapio))],
              [textos.status, <Situacao key="s" publicado={cardapio.publicado} />],
            ]}
          />
          <BotaoPublicar tabela="cardapios" id={cardapio.id} publicado={cardapio.publicado} />
          <hr className="border-linha" />
        </>
      )}
      <FormAgenda<Entrada, z.output<typeof esquemaCardapio>>
        campos={CAMPOS}
        inicial={inicial}
        resolver={zodResolver(esquemaCardapio)}
        aoCancelar={() => navegar('/app/admin/cardapios')}
        aoSalvar={async (d) => {
          const salvo = await salvar.mutateAsync({ ...d, id: cardapio?.id })
          navegar(`/app/admin/cardapios/${salvo.id}`)
        }}
      />
    </CartaoDetalhe>
  )
}

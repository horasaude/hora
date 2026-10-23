import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { EtiquetaBrilho } from '@/components/ui'
import { totalCardapio } from '@/domain/nutricao'
import { ExcluirLinha } from '../../components/ExcluirLinha'
import { CelulaAcao, celula, LinhaTabela, Situacao, Tabela } from '../../components/Tabela'
import { excluirCardapio, type CardapioLinha } from '../api/cardapios.api'
import { LISTA_CARDAPIOS } from '../hooks/useEditorCardapio'
import { lerRefeicoes } from '../schemas/plano'
import { textos } from '../textos'
import { tCardapios as t } from '../textos2'

type Tema = { id: string; titulo: string }
type Grupo = { tema: Tema | null; planos: CardapioLinha[] }

/** Um grupo por tema que tem plano (na ordem dos temas); sem tema no fim. */
function agrupar(dados: CardapioLinha[], temas: Tema[]): Grupo[] {
  const grupos: Grupo[] = temas
    .map((tema) => ({ tema, planos: dados.filter((c) => c.tema_id === tema.id) }))
    .filter((g) => g.planos.length > 0)
  const ids = new Set(temas.map((x) => x.id))
  const resto = dados.filter((c) => !c.tema_id || !ids.has(c.tema_id))
  if (resto.length > 0) grupos.push({ tema: null, planos: resto })
  return grupos
}

function CabecalhoGrupo({ g }: { g: Grupo }) {
  return (
    <tr className="border-b border-[#F0F2F1] bg-[#F8FAF9]">
      <th colSpan={6} scope="colgroup" className="px-3.5 py-2.5 text-left">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-[14px] font-bold text-verde-escuro">
            {g.tema?.titulo ?? t.semTema}
          </span>
          <span className="text-[12px] font-normal text-suave">{t.planos(g.planos.length)}</span>
          {g.tema && (
            <Link
              to={`${LISTA_CARDAPIOS}/novo?tema=${g.tema.id}`}
              className="ml-auto text-[12px] font-bold text-verde-escuro underline-offset-2 hover:underline"
            >
              {t.novoNoTema}
            </Link>
          )}
        </span>
      </th>
    </tr>
  )
}

function Linha({ c }: { c: CardapioLinha }) {
  const refeicoes = lerRefeicoes(c.refeicoes)
  const cliente = useQueryClient()
  return (
    <LinhaTabela ativa={false} para={`${LISTA_CARDAPIOS}/${c.id}`} titulo={c.titulo}>
      <td className="px-3.5 py-3">
        <EtiquetaBrilho tom="cinza">{c.objetivo}</EtiquetaBrilho>
      </td>
      <td className={celula}>{refeicoes.length}</td>
      <td className="px-3.5 py-3">
        {c.modelo === 'texto' ? (
          <span className="text-suave">{t.modelos.texto}</span>
        ) : (
          <EtiquetaBrilho tom="dourado">
            {textos.kcal(totalCardapio(refeicoes).kcal)}
          </EtiquetaBrilho>
        )}
      </td>
      <td className="px-3.5 py-3">
        <Situacao publicado={c.publicado} />
      </td>
      <CelulaAcao>
        <ExcluirLinha
          aoExcluir={async () => {
            await excluirCardapio(c.id)
            await cliente.invalidateQueries({ queryKey: ['cardapios'] })
          }}
        />
      </CelulaAcao>
    </LinhaTabela>
  )
}

/** Cardápios agrupados por tema: cada tema mostra quantos planos tem e o atalho para criar mais um. */
export function TabelaCardapios({ dados, temas }: { dados: CardapioLinha[]; temas: Tema[] }) {
  return (
    <Tabela colunas={t.colunas}>
      {agrupar(dados, temas).map((g) => [
        <CabecalhoGrupo key={g.tema?.id ?? 'sem'} g={g} />,
        ...g.planos.map((c) => <Linha key={c.id} c={c} />),
      ])}
      {dados.length === 0 && (
        <tr>
          <td colSpan={6} className="px-3.5 py-10 text-center text-[13px] text-suave">
            {textos.semResultado}
          </td>
        </tr>
      )}
    </Tabela>
  )
}
